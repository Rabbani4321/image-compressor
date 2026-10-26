(()=>{'use strict';
const $=id=>document.getElementById(id);
const form=$('qrForm'),typeSelect=$('qrType'),canvas=$('qrCanvas'),generateButton=$('generateButton'),downloadButton=$('downloadButton');
let currentCode=null,currentKind='',downloadUrl=null,downloadTimer=0,working=false;
function showError(message){const box=$('errorMessage');box.textContent=message;box.hidden=false}
function clearError(){const box=$('errorMessage');box.textContent='';box.hidden=true}
function setStatus(message){$('previewStatus').textContent=message}
function revokeDownload(){if(downloadTimer)clearTimeout(downloadTimer);downloadTimer=0;if(downloadUrl){URL.revokeObjectURL(downloadUrl);downloadUrl=null}}
function clearOutput(message='Waiting for details'){currentCode=null;currentKind='';canvas.hidden=true;canvas.width=1;canvas.height=1;$('emptyState').hidden=false;downloadButton.disabled=true;revokeDownload();setStatus(message);$('previewCaption').textContent='Generated codes can be scanned with a phone camera or QR scanner.'}
function escWifi(value){return value.replace(/([\\;,:"])/g,'\\$1')}
function phoneDigits(value){return value.replace(/[+\s().-]/g,'')}
function makePayload(){const type=typeSelect.value;
  if(type==='website'){
    const raw=$('websiteUrl').value.trim();if(!raw)throw Error('Enter a website URL to continue.');
    let url;try{url=new URL(raw)}catch{throw Error('Enter a valid URL beginning with https:// or http://.')}
    if(!['https:','http:'].includes(url.protocol))throw Error('Website QR codes support http:// and https:// links only.');
    return {kind:'website',payload:url.href,description:'Website link'}
  }
  if(type==='text'){const value=$('plainText').value;if(!value.trim())throw Error('Enter some text to continue.');return {kind:'text',payload:value,description:'Plain text'}}
  if(type==='whatsapp'){
    const raw=$('whatsappPhone').value.trim(),digits=phoneDigits(raw);if(!/^\+?[0-9][0-9\s().-]{5,24}$/.test(raw)||digits.length<7||digits.length>15)throw Error('Enter a valid WhatsApp number with its country code (7-15 digits).');
    const message=$('whatsappMessage').value;const payload='https://wa.me/'+digits+(message?'?text='+encodeURIComponent(message):'');return {kind:'whatsapp',payload,description:'WhatsApp chat'}
  }
  if(type==='wifi'){
    const ssid=$('wifiName').value,security=$('wifiSecurity').value,password=$('wifiPassword').value;if(!ssid.trim())throw Error('Enter the Wi-Fi network name (SSID).');
    if(/[\r\n\u0000-\u001f]/.test(ssid))throw Error('The network name cannot contain line breaks or control characters.');
    if(security==='WPA'&&!((password.length>=8&&password.length<=63&&/^[\x20-\x7e]+$/.test(password))||(password.length===64&&/^[a-f0-9]+$/i.test(password))))throw Error('WPA passwords must be 8-63 printable ASCII characters, or 64 hexadecimal characters.');
    if(security==='WEP'&&password.length===0)throw Error('Enter the WEP network password.');
    if(/[\r\n\u0000-\u001f]/.test(password))throw Error('The Wi-Fi password cannot contain line breaks or control characters.');
    const fields=['WIFI:T:'+security,'S:'+escWifi(ssid)];if(security!=='nopass')fields.push('P:'+escWifi(password));if($('wifiHidden').checked)fields.push('H:true');return {kind:'wifi',payload:fields.join(';')+';;',description:'Wi-Fi connection'}
  }
  if(type==='email'){
    const address=$('emailAddress').value.trim();if(!address||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))throw Error('Enter a valid email address.');
    const params=new URLSearchParams(),subject=$('emailSubject').value,body=$('emailBody').value;if(subject)params.set('subject',subject);if(body)params.set('body',body);return {kind:'email',payload:'mailto:'+address+(params.size?'?'+params.toString():''),description:'Email draft'}
  }
  if(type==='phone'){
    const raw=$('phoneNumber').value.trim(),digits=phoneDigits(raw);if(!/^\+?[0-9][0-9\s().-]{1,24}$/.test(raw)||digits.length<3||digits.length>15)throw Error('Enter a valid phone number with 3-15 digits.');
    const canonical=(raw.startsWith('+')?'+':'')+digits;return {kind:'phone',payload:'tel:'+canonical,description:'Phone number'}
  }
  throw Error('Choose a supported QR code type.')
}
function renderCode(code,size){const count=code.getModuleCount(),quiet=4,total=count+quiet*2,scale=size/total,ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw Error('Canvas is unavailable in this browser.');canvas.width=size;canvas.height=size;ctx.imageSmoothingEnabled=false;ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);ctx.fillStyle='#111827';
  for(let row=0;row<count;row++)for(let col=0;col<count;col++)if(code.isDark(row,col)){const x0=Math.round((col+quiet)*scale),y0=Math.round((row+quiet)*scale),x1=Math.round((col+quiet+1)*scale),y1=Math.round((row+quiet+1)*scale);ctx.fillRect(x0,y0,Math.max(1,x1-x0),Math.max(1,y1-y0))}
}
function generate(event){event?.preventDefault();if(working)return;clearError();clearOutput('Generating locally…');working=true;generateButton.disabled=true;generateButton.setAttribute('aria-busy','true');$('qrStage').setAttribute('aria-busy','true');try{if(typeof qrcode!=='function')throw Error('The QR encoder did not load. Check that qrcode-generator.min.js is beside index.html, then reload.');const data=makePayload(),code=qrcode(0,'M');code.addData(data.payload);code.make();renderCode(code,Number($('qrSize').value));currentCode=code;currentKind=data.kind;$('emptyState').hidden=true;canvas.hidden=false;canvas.setAttribute('aria-label','QR code for '+data.description);downloadButton.disabled=false;setStatus('Ready to scan');$('previewCaption').textContent=data.description+' · '+canvas.width+' × '+canvas.height+' px · Error correction M'}catch(error){clearOutput('Could not generate');const msg=/overflow|code length|too long|capacity/i.test(error.message||'')?'This content is too long for a QR code. Shorten it and try again.':error.message||'The QR code could not be generated.';showError(msg)}finally{working=false;generateButton.disabled=false;generateButton.removeAttribute('aria-busy');$('qrStage').setAttribute('aria-busy','false')}}
async function downloadPng(){if(!currentCode||working)return;working=true;downloadButton.disabled=true;clearError();setStatus('Preparing PNG…');try{const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('The browser could not create a PNG image.')),'image/png'));if(blob.type!=='image/png')throw Error('The browser did not return a PNG image.');revokeDownload();downloadUrl=URL.createObjectURL(blob);const link=document.createElement('a');link.href=downloadUrl;link.download='pixelpress-'+currentKind+'-qr.png';link.hidden=true;document.body.append(link);link.click();link.remove();downloadTimer=setTimeout(revokeDownload,30000);setStatus('PNG downloaded')}catch(error){showError(error.message||'Could not download this QR code.');setStatus('Download failed')}finally{working=false;downloadButton.disabled=!currentCode}}
function updateFields(){const active=typeSelect.value;document.querySelectorAll('[data-fields]').forEach(section=>{section.hidden=section.dataset.fields!==active});const noPassword=$('wifiSecurity').value==='nopass';$('wifiPasswordField').hidden=noPassword;$('wifiPassword').disabled=noPassword;if(noPassword)$('wifiPassword').value=''}
function changed(){clearError();if(currentCode)clearOutput('Details changed · generate an updated code');else setStatus('Ready when you are')}
function clearAll(){form.reset();typeSelect.value='website';$('qrSize').value='384';updateFields();clearError();clearOutput('Waiting for details');$('websiteUrl').focus()}
function theme(){const root=document.documentElement,isDark=root.dataset.theme!=='dark';root.dataset.theme=isDark?'dark':'light';try{localStorage.setItem('pixelpress-qr-theme',root.dataset.theme)}catch{}$('themeToggle').setAttribute('aria-label',isDark?'Switch to light theme':'Switch to dark theme');document.querySelector('meta[name="theme-color"]').content=isDark?'#0b1020':'#f4f6fb'}
try{const saved=localStorage.getItem('pixelpress-qr-theme');document.documentElement.dataset.theme=saved==='dark'?'dark':'light'}catch{document.documentElement.dataset.theme='light'}
$('themeToggle').setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?'Switch to light theme':'Switch to dark theme');document.querySelector('meta[name="theme-color"]').content=document.documentElement.dataset.theme==='dark'?'#0b1020':'#f4f6fb';
typeSelect.addEventListener('change',()=>{updateFields();changed()});$('wifiSecurity').addEventListener('change',()=>{updateFields();changed()});form.addEventListener('input',event=>{if(event.target!==typeSelect&&event.target.id!=='wifiSecurity'&&event.target.id!=='qrSize')changed()});form.addEventListener('change',event=>{if(event.target!==typeSelect&&event.target.id!=='wifiSecurity'&&event.target.id!=='qrSize')changed()});$('qrSize').addEventListener('change',()=>{if(!currentCode)return;try{renderCode(currentCode,Number($('qrSize').value));$('previewCaption').textContent=$('previewCaption').textContent.replace(/\d+ × \d+ px/,canvas.width+' × '+canvas.height+' px')}catch(error){clearOutput('Could not resize preview');showError(error.message)}});form.addEventListener('submit',generate);$('clearButton').addEventListener('click',clearAll);downloadButton.addEventListener('click',downloadPng);$('themeToggle').addEventListener('click',theme);updateFields();addEventListener('pagehide',revokeDownload);
})();