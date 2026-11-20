export function initAccount(trigger) {
  const dialog=document.createElement("dialog");
  dialog.id="dw-account-panel";
  dialog.setAttribute("aria-labelledby","dw-account-title");
  dialog.innerHTML=`<button type="button" class="dw-close" aria-label="Close account">×</button>
    <h2 id="dw-account-title">Sign in</h2><form>
    <label>Email<input name="email" type="email" maxlength="254" autocomplete="email" required></label>
    <label>Password<input name="password" type="password" minlength="8" maxlength="128" autocomplete="current-password" required></label>
    <button class="dw-submit">Sign in</button></form>
    <button type="button" class="dw-switch">Create account</button>
    <p role="status"></p><button type="button" class="dw-logout" hidden>Sign out</button>`;
  document.body.append(dialog);
  const get=s=>dialog.querySelector(s), form=get("form"), title=get("h2"), status=get("[role=status]");
  const toggle=get(".dw-switch"), submit=get(".dw-submit"), logout=get(".dw-logout");
  const original=trigger.innerHTML;
  let signup=false,email=null;
  const api=async(path,body)=>{
    const response=await fetch((window.dwConfig.chatBase || "").replace(/\/$/,"")+"/account/"+path,{
      credentials:"include",method:body?"POST":"GET",cache:"no-store",
      ...(body ? {headers:{"Content-Type":"application/json"},body:JSON.stringify(body)} : {})
    });
    const data=await response.json().catch(()=>({error:"Account server unavailable."}));
    if(!response.ok || data.error)throw Error(data.error||"Account server unavailable.");
    return data;
  };
  function draw(){
    const signed=Boolean(email);
    form.hidden=toggle.hidden=signed;logout.hidden=!signed;
    title.textContent=signed?"Your account":signup?"Create account":"Sign in";
    submit.textContent=title.textContent;toggle.textContent=signup?"Already registered? Sign in":"Create account";
    form.elements.password.autocomplete=signup?"new-password":"current-password";
    status.textContent=email||"";
    if(signed)trigger.textContent=email[0].toUpperCase();else trigger.innerHTML=original;
    trigger.setAttribute("aria-label",signed?"Your account":"Account and sign in");
  }
  api("me").then(data=>{email=data.email;draw();}).catch(()=>{});
  trigger.onclick=()=>{draw();dialog.showModal();};
  get(".dw-close").onclick=()=>dialog.close();
  toggle.onclick=()=>{signup=!signup;draw();};
  form.onsubmit=async e=>{
    e.preventDefault();submit.disabled=toggle.disabled=true;
    try{
      const data=await api(signup?"signup":"login",{email:form.elements.email.value,password:form.elements.password.value});
      const session=await api("me");
      if(session.email!==data.email)throw Error("Session cookie unavailable. Open the site on the account server.");
      email=session.email;form.reset();draw();
    }catch(e){status.textContent=e.message;}finally{submit.disabled=toggle.disabled=false;}
  };
  logout.onclick=async()=>{try{await api("logout",{});email=null;signup=false;draw();}catch(e){status.textContent=e.message;}};
}
