(() => {
  let pending, profile = null;
  const config = () => window.MadaarFirebaseConfig || {};
  const say = (ar,en) => localStorage.getItem('madaarLanguage')==='en'?en:ar;
  function errorMessage(error) {
    const messages = {
      'auth/invalid-credential':['البريد الإلكتروني أو كلمة المرور غير صحيحة.','Incorrect email or password.'],
      'auth/invalid-api-key':['تحقق من apiKey لتطبيق الويب في firebase-config.js.','Check the Web App apiKey in firebase-config.js.'],
      'auth/email-already-in-use':['هذا البريد مرتبط بحساب موجود.','This email already has an account.'],
      'auth/weak-password':['استخدم كلمة مرور أقوى من ستة أحرف على الأقل.','Use a stronger password with at least six characters.'],
      'auth/invalid-email':['أدخل بريدًا إلكترونيًا صحيحًا.','Enter a valid email address.'],
      'auth/operation-not-allowed':['فعّل طريقة الدخول المطلوبة في Firebase Authentication.','Enable this sign-in method in Firebase Authentication.'],
      'auth/too-many-requests':['محاولات كثيرة؛ انتظر قليلًا ثم أعد المحاولة.','Too many attempts. Wait before trying again.'],
      'auth/network-request-failed':['تعذر الاتصال بخدمة الحسابات. تحقق من الإنترنت.','Cannot reach authentication. Check your connection.'],
      'PERMISSION_DENIED':['تعذر الوصول إلى بيانات الحساب. طبّق قواعد قاعدة البيانات المرفقة.','Account data access denied. Apply the supplied database rules.']
    };
    if(error instanceof TypeError)return say('تعذر تحميل خدمة Firebase. تحقق من الإنترنت ثم أعد المحاولة.','Cannot load Firebase. Check your connection and try again.');
    return messages[error.code]?say(...messages[error.code]):error.message||say('تعذر إكمال العملية.','Could not complete the operation.');
  }
  async function initialize() {
    if(!config().firebase?.apiKey)throw Error(say('أضف apiKey في firebase-config.js لتفعيل حسابات Firebase.','Add apiKey in firebase-config.js to enable Firebase accounts.'));
    if(!pending)pending=(async()=>{
      const root='https://www.gstatic.com/firebasejs/12.19.0/';
      const [appSDK,authSDK,dbSDK]=await Promise.all([import(root+'firebase-app.js'),import(root+'firebase-auth.js'),import(root+'firebase-database.js')]);
      const app=appSDK.initializeApp(config().firebase),auth=authSDK.getAuth(app),db=dbSDK.getDatabase(app);
      await authSDK.setPersistence(auth,authSDK.browserLocalPersistence);
      await auth.authStateReady();
      authSDK.onAuthStateChanged(auth,user=>{
        profile=null;
        if(user)sessionStorage.setItem('madaarSession',JSON.stringify({mode:user.isAnonymous?'guest':'account',mock:false,uid:user.uid,displayName:user.displayName||''}));
        else if(JSON.parse(sessionStorage.getItem('madaarSession')||'null')?.mock===false)sessionStorage.removeItem('madaarSession');
        window.dispatchEvent(new Event('madaar-auth-change'));
      });
      return {auth,db,authSDK,dbSDK};
    })().catch(error=>{pending=null;throw error;});
    return pending;
  }
  async function readAccount(){
    const {auth,db,dbSDK}=await initialize();if(!auth.currentUser)return null;
    const snapshot=await dbSDK.get(dbSDK.ref(db,`users/${auth.currentUser.uid}`));
    const data=snapshot.val()||{};profile=data.profile||null;return data;
  }
  async function saveProfile(values){
    const {auth,db,dbSDK}=await initialize();const user=auth.currentUser;if(!user||user.isAnonymous)return;
    const allowed={displayName:String(values.displayName||user.displayName||'').slice(0,60),language:values.language==='en'?'en':'ar',category:Math.max(0,Math.min(2,Number(values.category)||0)),newLearner:!!values.newLearner,updatedAt:dbSDK.serverTimestamp()};
    await dbSDK.set(dbSDK.ref(db,`users/${user.uid}/profile`),allowed);profile=allowed;
  }
  window.MadaarFirebase={config,initialize,errorMessage,readAccount,saveProfile,getProfile:()=>profile,
    async login(email,password){const {auth,authSDK}=await initialize();return authSDK.signInWithEmailAndPassword(auth,email,password);},
    async register(email,password,name){const {auth,authSDK}=await initialize();const result=await authSDK.createUserWithEmailAndPassword(auth,email,password);await authSDK.updateProfile(result.user,{displayName:name.trim().slice(0,60)});return result;},
    async guest(){const {auth,authSDK}=await initialize();if(auth.currentUser&&!auth.currentUser.isAnonymous)await authSDK.signOut(auth);if(!auth.currentUser)await authSDK.signInAnonymously(auth);},
    async logout(){if(!pending&&!config().firebase?.apiKey)return;const {auth,authSDK}=await initialize();await authSDK.signOut(auth);profile=null;},
    async resetPassword(email){const {auth,authSDK}=await initialize();return authSDK.sendPasswordResetEmail(auth,email);},
    async token(){const {auth}=await initialize();if(!auth.currentUser)await this.guest();return auth.currentUser.getIdToken();}
  };
})();
