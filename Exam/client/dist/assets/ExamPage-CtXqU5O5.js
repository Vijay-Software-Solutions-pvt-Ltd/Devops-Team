import{a as Lt,u as Mt,r as w,j as l,F as $t,b as Ft,c as Ht,d as zt,e as Wt,f as Vt,g as qt}from"./index-DyprfCce.js";import{a as N}from"./api-Bbd7J0M8.js";var Me={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const it=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let s=t.charCodeAt(r);s<128?e[n++]=s:s<2048?(e[n++]=s>>6|192,e[n++]=s&63|128):(s&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=s>>18|240,e[n++]=s>>12&63|128,e[n++]=s>>6&63|128,e[n++]=s&63|128):(e[n++]=s>>12|224,e[n++]=s>>6&63|128,e[n++]=s&63|128)}return e},Gt=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const s=t[n++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=t[n++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=t[n++],o=t[n++],c=t[n++],a=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(a>>10)),e[r++]=String.fromCharCode(56320+(a&1023))}else{const i=t[n++],o=t[n++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},ot={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<t.length;s+=3){const i=t[s],o=s+1<t.length,c=o?t[s+1]:0,a=s+2<t.length,u=a?t[s+2]:0,v=i>>2,x=(i&3)<<4|c>>4;let f=(c&15)<<2|u>>6,y=u&63;a||(y=64,o||(f=64)),r.push(n[v],n[x],n[f],n[y])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(it(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Gt(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<t.length;){const i=n[t.charAt(s++)],c=s<t.length?n[t.charAt(s)]:0;++s;const u=s<t.length?n[t.charAt(s)]:64;++s;const x=s<t.length?n[t.charAt(s)]:64;if(++s,i==null||c==null||u==null||x==null)throw new Kt;const f=i<<2|c>>4;if(r.push(f),u!==64){const y=c<<4&240|u>>2;if(r.push(y),x!==64){const S=u<<6&192|x;r.push(S)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Kt extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Xt=function(t){const e=it(t);return ot.encodeByteArray(e,!0)},re=function(t){return Xt(t).replace(/\./g,"")},Jt=function(t){try{return ot.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qt=()=>Yt().__FIREBASE_DEFAULTS__,Zt=()=>{if(typeof process>"u"||typeof Me>"u")return;const t=Me.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},en=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Jt(t[1]);return e&&JSON.parse(e)},at=()=>{try{return Qt()||Zt()||en()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},tn=t=>{var e,n;return(n=(e=at())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},nn=t=>{const e=tn(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},ct=()=>{var t;return(t=at())===null||t===void 0?void 0:t.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sn(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",s=t.iat||0,i=t.sub||t.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},t);return[re(JSON.stringify(n)),re(JSON.stringify(o)),""].join(".")}function on(){try{return typeof indexedDB=="object"}catch{return!1}}function an(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn="FirebaseError";class X extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=cn,Object.setPrototypeOf(this,X.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,lt.prototype.create)}}class lt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?ln(i,r):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new X(s,c,r)}}function ln(t,e){return t.replace(un,(n,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const un=/\{\$([^}]+)}/g;function fe(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const s of n){if(!r.includes(s))return!1;const i=t[s],o=e[s];if($e(i)&&$e(o)){if(!fe(i,o))return!1}else if(i!==o)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function $e(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oe(t){return t&&t._delegate?t._delegate:t}class Q{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new rn;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(fn(e))try{this.getOrInitializeService({instanceIdentifier:W})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=W){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=W){return this.instances.has(e)}getOptions(e=W){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[i,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);r===c&&o.resolve(s)}return s}onInit(e,n){var r;const s=this.normalizeInstanceIdentifier(n),i=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;i.add(e),this.onInitCallbacks.set(s,i);const o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:hn(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=W){return this.component?this.component.multipleInstances?e:W:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function hn(t){return t===W?void 0:t}function fn(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new dn(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var g;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(g||(g={}));const gn={debug:g.DEBUG,verbose:g.VERBOSE,info:g.INFO,warn:g.WARN,error:g.ERROR,silent:g.SILENT},mn=g.INFO,bn={[g.DEBUG]:"log",[g.VERBOSE]:"log",[g.INFO]:"info",[g.WARN]:"warn",[g.ERROR]:"error"},_n=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),s=bn[e];if(s)console[s](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class yn{constructor(e){this.name=e,this._logLevel=mn,this._logHandler=_n,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in g))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?gn[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,g.DEBUG,...e),this._logHandler(this,g.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,g.VERBOSE,...e),this._logHandler(this,g.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,g.INFO,...e),this._logHandler(this,g.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,g.WARN,...e),this._logHandler(this,g.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,g.ERROR,...e),this._logHandler(this,g.ERROR,...e)}}const wn=(t,e)=>e.some(n=>t instanceof n);let Fe,He;function xn(){return Fe||(Fe=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function En(){return He||(He=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ut=new WeakMap,pe=new WeakMap,dt=new WeakMap,ae=new WeakMap,we=new WeakMap;function vn(t){const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("success",i),t.removeEventListener("error",o)},i=()=>{n($(t.result)),s()},o=()=>{r(t.error),s()};t.addEventListener("success",i),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&ut.set(n,t)}).catch(()=>{}),we.set(e,t),e}function In(t){if(pe.has(t))return;const e=new Promise((n,r)=>{const s=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",o),t.removeEventListener("abort",o)},i=()=>{n(),s()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",i),t.addEventListener("error",o),t.addEventListener("abort",o)});pe.set(t,e)}let ge={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return pe.get(t);if(e==="objectStoreNames")return t.objectStoreNames||dt.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return $(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Rn(t){ge=t(ge)}function Sn(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(ce(this),e,...n);return dt.set(r,e.sort?e.sort():[e]),$(r)}:En().includes(t)?function(...e){return t.apply(ce(this),e),$(ut.get(this))}:function(...e){return $(t.apply(ce(this),e))}}function Tn(t){return typeof t=="function"?Sn(t):(t instanceof IDBTransaction&&In(t),wn(t,xn())?new Proxy(t,ge):t)}function $(t){if(t instanceof IDBRequest)return vn(t);if(ae.has(t))return ae.get(t);const e=Tn(t);return e!==t&&(ae.set(t,e),we.set(e,t)),e}const ce=t=>we.get(t);function Cn(t,e,{blocked:n,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(t,e),c=$(o);return r&&o.addEventListener("upgradeneeded",a=>{r($(o.result),a.oldVersion,a.newVersion,$(o.transaction),a)}),n&&o.addEventListener("blocked",a=>n(a.oldVersion,a.newVersion,a)),c.then(a=>{i&&a.addEventListener("close",()=>i()),s&&a.addEventListener("versionchange",u=>s(u.oldVersion,u.newVersion,u))}).catch(()=>{}),c}const An=["get","getKey","getAll","getAllKeys","count"],Dn=["put","add","delete","clear"],le=new Map;function ze(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(le.get(e))return le.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,s=Dn.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||An.includes(n)))return;const i=async function(o,...c){const a=this.transaction(o,s?"readwrite":"readonly");let u=a.store;return r&&(u=u.index(c.shift())),(await Promise.all([u[n](...c),s&&a.done]))[0]};return le.set(e,i),i}Rn(t=>({...t,get:(e,n,r)=>ze(e,n)||t.get(e,n,r),has:(e,n)=>!!ze(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(On(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function On(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const me="@firebase/app",We="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const j=new yn("@firebase/app"),Bn="@firebase/app-compat",Nn="@firebase/analytics-compat",Pn="@firebase/analytics",Un="@firebase/app-check-compat",jn="@firebase/app-check",Ln="@firebase/auth",Mn="@firebase/auth-compat",$n="@firebase/database",Fn="@firebase/data-connect",Hn="@firebase/database-compat",zn="@firebase/functions",Wn="@firebase/functions-compat",Vn="@firebase/installations",qn="@firebase/installations-compat",Gn="@firebase/messaging",Kn="@firebase/messaging-compat",Xn="@firebase/performance",Jn="@firebase/performance-compat",Yn="@firebase/remote-config",Qn="@firebase/remote-config-compat",Zn="@firebase/storage",er="@firebase/storage-compat",tr="@firebase/firestore",nr="@firebase/vertexai-preview",rr="@firebase/firestore-compat",sr="firebase",ir="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const be="[DEFAULT]",or={[me]:"fire-core",[Bn]:"fire-core-compat",[Pn]:"fire-analytics",[Nn]:"fire-analytics-compat",[jn]:"fire-app-check",[Un]:"fire-app-check-compat",[Ln]:"fire-auth",[Mn]:"fire-auth-compat",[$n]:"fire-rtdb",[Fn]:"fire-data-connect",[Hn]:"fire-rtdb-compat",[zn]:"fire-fn",[Wn]:"fire-fn-compat",[Vn]:"fire-iid",[qn]:"fire-iid-compat",[Gn]:"fire-fcm",[Kn]:"fire-fcm-compat",[Xn]:"fire-perf",[Jn]:"fire-perf-compat",[Yn]:"fire-rc",[Qn]:"fire-rc-compat",[Zn]:"fire-gcs",[er]:"fire-gcs-compat",[tr]:"fire-fst",[rr]:"fire-fst-compat",[nr]:"fire-vertex","fire-js":"fire-js",[sr]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const se=new Map,ar=new Map,_e=new Map;function Ve(t,e){try{t.container.addComponent(e)}catch(n){j.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function ie(t){const e=t.name;if(_e.has(e))return j.debug(`There were multiple attempts to register component ${e}.`),!1;_e.set(e,t);for(const n of se.values())Ve(n,t);for(const n of ar.values())Ve(n,t);return!0}function cr(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lr={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},F=new lt("app","Firebase",lr);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{constructor(e,n,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Q("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw F.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dr=ir;function ht(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=Object.assign({name:be,automaticDataCollectionEnabled:!1},e),s=r.name;if(typeof s!="string"||!s)throw F.create("bad-app-name",{appName:String(s)});if(n||(n=ct()),!n)throw F.create("no-options");const i=se.get(s);if(i){if(fe(n,i.options)&&fe(r,i.config))return i;throw F.create("duplicate-app",{appName:s})}const o=new pn(s);for(const a of _e.values())o.addComponent(a);const c=new ur(n,r,o);return se.set(s,c),c}function hr(t=be){const e=se.get(t);if(!e&&t===be&&ct())return ht();if(!e)throw F.create("no-app",{appName:t});return e}function K(t,e,n){var r;let s=(r=or[t])!==null&&r!==void 0?r:t;n&&(s+=`-${n}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const c=[`Unable to register library "${s}" with version "${e}":`];i&&c.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&c.push("and"),o&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),j.warn(c.join(" "));return}ie(new Q(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fr="firebase-heartbeat-database",pr=1,Z="firebase-heartbeat-store";let ue=null;function ft(){return ue||(ue=Cn(fr,pr,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Z)}catch(n){console.warn(n)}}}}).catch(t=>{throw F.create("idb-open",{originalErrorMessage:t.message})})),ue}async function gr(t){try{const n=(await ft()).transaction(Z),r=await n.objectStore(Z).get(pt(t));return await n.done,r}catch(e){if(e instanceof X)j.warn(e.message);else{const n=F.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});j.warn(n.message)}}}async function qe(t,e){try{const r=(await ft()).transaction(Z,"readwrite");await r.objectStore(Z).put(e,pt(t)),await r.done}catch(n){if(n instanceof X)j.warn(n.message);else{const r=F.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});j.warn(r.message)}}}function pt(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mr=1024,br=30*24*60*60*1e3;class _r{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new wr(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Ge();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const c=new Date(o.date).valueOf();return Date.now()-c<=br}),this._storage.overwrite(this._heartbeatsCache))}catch(r){j.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Ge(),{heartbeatsToSend:r,unsentEntries:s}=yr(this._heartbeatsCache.heartbeats),i=re(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return j.warn(n),""}}}function Ge(){return new Date().toISOString().substring(0,10)}function yr(t,e=mr){const n=[];let r=t.slice();for(const s of t){const i=n.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Ke(n)>e){i.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Ke(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class wr{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return on()?an().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await gr(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return qe(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return qe(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Ke(t){return re(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(t){ie(new Q("platform-logger",e=>new kn(e),"PRIVATE")),ie(new Q("heartbeat",e=>new _r(e),"PRIVATE")),K(me,We,t),K(me,We,"esm2017"),K("fire-js","")}xr("");var Er="firebase",vr="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */K(Er,vr,"app");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gt="firebasestorage.googleapis.com",mt="storageBucket",Ir=2*60*1e3,Rr=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class b extends X{constructor(e,n,r=0){super(de(e),`Firebase Storage: ${n} (${de(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,b.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return de(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var m;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(m||(m={}));function de(t){return"storage/"+t}function xe(){const t="An unknown error occurred, please check the error payload for server response.";return new b(m.UNKNOWN,t)}function Sr(t){return new b(m.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function Tr(t){return new b(m.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Cr(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new b(m.UNAUTHENTICATED,t)}function Ar(){return new b(m.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Dr(t){return new b(m.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function kr(){return new b(m.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Or(){return new b(m.CANCELED,"User canceled the upload/download.")}function Br(t){return new b(m.INVALID_URL,"Invalid URL '"+t+"'.")}function Nr(t){return new b(m.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function Pr(){return new b(m.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+mt+"' property when initializing the app?")}function Ur(){return new b(m.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function jr(){return new b(m.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function Lr(t){return new b(m.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function ye(t){return new b(m.INVALID_ARGUMENT,t)}function bt(){return new b(m.APP_DELETED,"The Firebase app was deleted.")}function Mr(t){return new b(m.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function Y(t,e){return new b(m.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function J(t){throw new b(m.INTERNAL_ERROR,"Internal error: "+t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let r;try{r=A.makeFromUrl(e,n)}catch{return new A(e,"")}if(r.path==="")return r;throw Nr(e)}static makeFromUrl(e,n){let r=null;const s="([A-Za-z0-9.\\-_]+)";function i(I){I.path.charAt(I.path.length-1)==="/"&&(I.path_=I.path_.slice(0,-1))}const o="(/(.*))?$",c=new RegExp("^gs://"+s+o,"i"),a={bucket:1,path:3};function u(I){I.path_=decodeURIComponent(I.path)}const v="v[A-Za-z0-9_]+",x=n.replace(/[.]/g,"\\."),f="(/([^?#]*).*)?$",y=new RegExp(`^https?://${x}/${v}/b/${s}/o${f}`,"i"),S={bucket:1,path:3},D=n===gt?"(?:storage.googleapis.com|storage.cloud.google.com)":n,_="([^?#]*)",O=new RegExp(`^https?://${D}/${s}/${_}`,"i"),T=[{regex:c,indices:a,postModify:i},{regex:y,indices:S,postModify:u},{regex:O,indices:{bucket:1,path:2},postModify:u}];for(let I=0;I<T.length;I++){const B=T[I],R=B.regex.exec(e);if(R){const L=R[B.indices.bucket];let H=R[B.indices.path];H||(H=""),r=new A(L,H),B.postModify(r);break}}if(r==null)throw Br(e);return r}}class $r{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fr(t,e,n){let r=1,s=null,i=null,o=!1,c=0;function a(){return c===2}let u=!1;function v(..._){u||(u=!0,e.apply(null,_))}function x(_){s=setTimeout(()=>{s=null,t(y,a())},_)}function f(){i&&clearTimeout(i)}function y(_,...O){if(u){f();return}if(_){f(),v.call(null,_,...O);return}if(a()||o){f(),v.call(null,_,...O);return}r<64&&(r*=2);let T;c===1?(c=2,T=0):T=(r+Math.random())*1e3,x(T)}let S=!1;function D(_){S||(S=!0,f(),!u&&(s!==null?(_||(c=2),clearTimeout(s),x(0)):_||(c=1)))}return x(0),i=setTimeout(()=>{o=!0,D(!0)},n),D}function Hr(t){t(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zr(t){return t!==void 0}function Wr(t){return typeof t=="object"&&!Array.isArray(t)}function Ee(t){return typeof t=="string"||t instanceof String}function Xe(t){return ve()&&t instanceof Blob}function ve(){return typeof Blob<"u"}function Je(t,e,n,r){if(r<e)throw ye(`Invalid value for '${t}'. Expected ${e} or greater.`);if(r>n)throw ye(`Invalid value for '${t}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(t,e,n){let r=e;return n==null&&(r=`https://${e}`),`${n}://${r}/v0${t}`}function _t(t){const e=encodeURIComponent;let n="?";for(const r in t)if(t.hasOwnProperty(r)){const s=e(r)+"="+e(t[r]);n=n+s+"&"}return n=n.slice(0,-1),n}var V;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(V||(V={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vr(t,e){const n=t>=500&&t<600,s=[408,429].indexOf(t)!==-1,i=e.indexOf(t)!==-1;return n||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(e,n,r,s,i,o,c,a,u,v,x,f=!0){this.url_=e,this.method_=n,this.headers_=r,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=c,this.errorCallback_=a,this.timeout_=u,this.progressCallback_=v,this.connectionFactory_=x,this.retry=f,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((y,S)=>{this.resolve_=y,this.reject_=S,this.start_()})}start_(){const e=(r,s)=>{if(s){r(!1,new te(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=c=>{const a=c.loaded,u=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(a,u)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const c=i.getErrorCode()===V.NO_ERROR,a=i.getStatus();if(!c||Vr(a,this.additionalRetryCodes_)&&this.retry){const v=i.getErrorCode()===V.ABORT;r(!1,new te(!1,null,v));return}const u=this.successCodes_.indexOf(a)!==-1;r(!0,new te(u,i))})},n=(r,s)=>{const i=this.resolve_,o=this.reject_,c=s.connection;if(s.wasSuccessCode)try{const a=this.callback_(c,c.getResponse());zr(a)?i(a):i()}catch(a){o(a)}else if(c!==null){const a=xe();a.serverResponse=c.getErrorText(),this.errorCallback_?o(this.errorCallback_(c,a)):o(a)}else if(s.canceled){const a=this.appDelete_?bt():Or();o(a)}else{const a=kr();o(a)}};this.canceled_?n(!1,new te(!1,null,!0)):this.backoffId_=Fr(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Hr(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class te{constructor(e,n,r){this.wasSuccessCode=e,this.connection=n,this.canceled=!!r}}function Gr(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function Kr(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Xr(t,e){e&&(t["X-Firebase-GMPID"]=e)}function Jr(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function Yr(t,e,n,r,s,i,o=!0){const c=_t(t.urlParams),a=t.url+c,u=Object.assign({},t.headers);return Xr(u,e),Gr(u,n),Kr(u,i),Jr(u,r),new qr(a,t.method,u,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,s,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qr(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function Zr(...t){const e=Qr();if(e!==void 0){const n=new e;for(let r=0;r<t.length;r++)n.append(t[r]);return n.getBlob()}else{if(ve())return new Blob(t);throw new b(m.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function es(t,e,n){return t.webkitSlice?t.webkitSlice(e,n):t.mozSlice?t.mozSlice(e,n):t.slice?t.slice(e,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ts(t){if(typeof atob>"u")throw Lr("base-64");return atob(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class he{constructor(e,n){this.data=e,this.contentType=n||null}}function yt(t,e){switch(t){case P.RAW:return new he(wt(e));case P.BASE64:case P.BASE64URL:return new he(xt(t,e));case P.DATA_URL:return new he(rs(e),ss(e))}throw xe()}function wt(t){const e=[];for(let n=0;n<t.length;n++){let r=t.charCodeAt(n);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(n<t.length-1&&(t.charCodeAt(n+1)&64512)===56320))e.push(239,191,189);else{const i=r,o=t.charCodeAt(++n);r=65536|(i&1023)<<10|o&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function ns(t){let e;try{e=decodeURIComponent(t)}catch{throw Y(P.DATA_URL,"Malformed data URL.")}return wt(e)}function xt(t,e){switch(t){case P.BASE64:{const s=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(s||i)throw Y(t,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case P.BASE64URL:{const s=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(s||i)throw Y(t,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=ts(e)}catch(s){throw s.message.includes("polyfill")?s:Y(t,"Invalid character found")}const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}class Et{constructor(e){this.base64=!1,this.contentType=null;const n=e.match(/^data:([^,]+)?,/);if(n===null)throw Y(P.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=n[1]||null;r!=null&&(this.base64=is(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function rs(t){const e=new Et(t);return e.base64?xt(P.BASE64,e.rest):ns(e.rest)}function ss(t){return new Et(t).contentType}function is(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e,n){let r=0,s="";Xe(e)?(this.data_=e,r=e.size,s=e.type):e instanceof ArrayBuffer?(n?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(n?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=s}size(){return this.size_}type(){return this.type_}slice(e,n){if(Xe(this.data_)){const r=this.data_,s=es(r,e,n);return s===null?null:new M(s)}else{const r=new Uint8Array(this.data_.buffer,e,n-e);return new M(r,!0)}}static getBlob(...e){if(ve()){const n=e.map(r=>r instanceof M?r.data_:r);return new M(Zr.apply(null,n))}else{const n=e.map(o=>Ee(o)?yt(P.RAW,o).data:o.data_);let r=0;n.forEach(o=>{r+=o.byteLength});const s=new Uint8Array(r);let i=0;return n.forEach(o=>{for(let c=0;c<o.length;c++)s[i++]=o[c]}),new M(s,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vt(t){let e;try{e=JSON.parse(t)}catch{return null}return Wr(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function os(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function as(t,e){const n=e.split("/").filter(r=>r.length>0).join("/");return t.length===0?n:t+"/"+n}function It(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cs(t,e){return e}class C{constructor(e,n,r,s){this.server=e,this.local=n||e,this.writable=!!r,this.xform=s||cs}}let ne=null;function ls(t){return!Ee(t)||t.length<2?t:It(t)}function Rt(){if(ne)return ne;const t=[];t.push(new C("bucket")),t.push(new C("generation")),t.push(new C("metageneration")),t.push(new C("name","fullPath",!0));function e(i,o){return ls(o)}const n=new C("name");n.xform=e,t.push(n);function r(i,o){return o!==void 0?Number(o):o}const s=new C("size");return s.xform=r,t.push(s),t.push(new C("timeCreated")),t.push(new C("updated")),t.push(new C("md5Hash",null,!0)),t.push(new C("cacheControl",null,!0)),t.push(new C("contentDisposition",null,!0)),t.push(new C("contentEncoding",null,!0)),t.push(new C("contentLanguage",null,!0)),t.push(new C("contentType",null,!0)),t.push(new C("metadata","customMetadata",!0)),ne=t,ne}function us(t,e){function n(){const r=t.bucket,s=t.fullPath,i=new A(r,s);return e._makeStorageReference(i)}Object.defineProperty(t,"ref",{get:n})}function ds(t,e,n){const r={};r.type="file";const s=n.length;for(let i=0;i<s;i++){const o=n[i];r[o.local]=o.xform(r,e[o.server])}return us(r,t),r}function St(t,e,n){const r=vt(e);return r===null?null:ds(t,r,n)}function hs(t,e,n,r){const s=vt(e);if(s===null||!Ee(s.downloadTokens))return null;const i=s.downloadTokens;if(i.length===0)return null;const o=encodeURIComponent;return i.split(",").map(u=>{const v=t.bucket,x=t.fullPath,f="/b/"+o(v)+"/o/"+o(x),y=Ie(f,n,r),S=_t({alt:"media",token:u});return y+S})[0]}function fs(t,e){const n={},r=e.length;for(let s=0;s<r;s++){const i=e[s];i.writable&&(n[i.server]=t[i.local])}return JSON.stringify(n)}class Tt{constructor(e,n,r,s){this.url=e,this.method=n,this.handler=r,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ct(t){if(!t)throw xe()}function ps(t,e){function n(r,s){const i=St(t,s,e);return Ct(i!==null),i}return n}function gs(t,e){function n(r,s){const i=St(t,s,e);return Ct(i!==null),hs(i,s,t.host,t._protocol)}return n}function At(t){function e(n,r){let s;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?s=Ar():s=Cr():n.getStatus()===402?s=Tr(t.bucket):n.getStatus()===403?s=Dr(t.path):s=r,s.status=n.getStatus(),s.serverResponse=r.serverResponse,s}return e}function ms(t){const e=At(t);function n(r,s){let i=e(r,s);return r.getStatus()===404&&(i=Sr(t.path)),i.serverResponse=s.serverResponse,i}return n}function bs(t,e,n){const r=e.fullServerUrl(),s=Ie(r,t.host,t._protocol),i="GET",o=t.maxOperationRetryTime,c=new Tt(s,i,gs(t,n),o);return c.errorHandler=ms(e),c}function _s(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function ys(t,e,n){const r=Object.assign({},n);return r.fullPath=t.path,r.size=e.size(),r.contentType||(r.contentType=_s(null,e)),r}function ws(t,e,n,r,s){const i=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function c(){let T="";for(let I=0;I<2;I++)T=T+Math.random().toString().slice(2);return T}const a=c();o["Content-Type"]="multipart/related; boundary="+a;const u=ys(e,r,s),v=fs(u,n),x="--"+a+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+v+`\r
--`+a+`\r
Content-Type: `+u.contentType+`\r
\r
`,f=`\r
--`+a+"--",y=M.getBlob(x,r,f);if(y===null)throw Ur();const S={name:u.fullPath},D=Ie(i,t.host,t._protocol),_="POST",O=t.maxUploadRetryTime,U=new Tt(D,_,ps(t,n),O);return U.urlParams=S,U.headers=o,U.body=y.uploadData(),U.errorHandler=At(e),U}class xs{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=V.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=V.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=V.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,n,r,s){if(this.sent_)throw J("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(n,e,!0),s!==void 0)for(const i in s)s.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,s[i].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw J("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw J("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw J("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw J("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class Es extends xs{initXhr(){this.xhr_.responseType="text"}}function Dt(){return new Es}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e,n){this._service=e,n instanceof A?this._location=n:this._location=A.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new q(e,n)}get root(){const e=new A(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return It(this._location.path)}get storage(){return this._service}get parent(){const e=os(this._location.path);if(e===null)return null;const n=new A(this._location.bucket,e);return new q(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw Mr(e)}}function vs(t,e,n){t._throwIfRoot("uploadBytes");const r=ws(t.storage,t._location,Rt(),new M(e,!0),n);return t.storage.makeRequestWithTokens(r,Dt).then(s=>({metadata:s,ref:t}))}function Is(t,e,n=P.RAW,r){t._throwIfRoot("uploadString");const s=yt(n,e),i=Object.assign({},r);return i.contentType==null&&s.contentType!=null&&(i.contentType=s.contentType),vs(t,s.data,i)}function Rs(t){t._throwIfRoot("getDownloadURL");const e=bs(t.storage,t._location,Rt());return t.storage.makeRequestWithTokens(e,Dt).then(n=>{if(n===null)throw jr();return n})}function Ss(t,e){const n=as(t._location.path,e),r=new A(t._location.bucket,n);return new q(t.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ts(t){return/^[A-Za-z]+:\/\//.test(t)}function Cs(t,e){return new q(t,e)}function kt(t,e){if(t instanceof Re){const n=t;if(n._bucket==null)throw Pr();const r=new q(n,n._bucket);return e!=null?kt(r,e):r}else return e!==void 0?Ss(t,e):t}function As(t,e){if(e&&Ts(e)){if(t instanceof Re)return Cs(t,e);throw ye("To use ref(service, url), the first argument must be a Storage instance.")}else return kt(t,e)}function Ye(t,e){const n=e==null?void 0:e[mt];return n==null?null:A.makeFromBucketSpec(n,t)}function Ds(t,e,n,r={}){t.host=`${e}:${n}`,t._protocol="http";const{mockUserToken:s}=r;s&&(t._overrideAuthToken=typeof s=="string"?s:sn(s,t.app.options.projectId))}class Re{constructor(e,n,r,s,i){this.app=e,this._authProvider=n,this._appCheckProvider=r,this._url=s,this._firebaseVersion=i,this._bucket=null,this._host=gt,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Ir,this._maxUploadRetryTime=Rr,this._requests=new Set,s!=null?this._bucket=A.makeFromBucketSpec(s,this._host):this._bucket=Ye(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=A.makeFromBucketSpec(this._url,e):this._bucket=Ye(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Je("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Je("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new q(this,e)}_makeRequest(e,n,r,s,i=!0){if(this._deleted)return new $r(bt());{const o=Yr(e,this._appId,r,s,n,this._firebaseVersion,i);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,n){const[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,r,s).getPromise()}}const Qe="@firebase/storage",Ze="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ot="storage";function ks(t,e,n,r){return t=oe(t),Is(t,e,n,r)}function Os(t){return t=oe(t),Rs(t)}function Bs(t,e){return t=oe(t),As(t,e)}function Ns(t=hr(),e){t=oe(t);const r=cr(t,Ot).getImmediate({identifier:e}),s=nn("storage");return s&&Ps(r,...s),r}function Ps(t,e,n,r={}){Ds(t,e,n,r)}function Us(t,{instanceIdentifier:e}){const n=t.getProvider("app").getImmediate(),r=t.getProvider("auth-internal"),s=t.getProvider("app-check-internal");return new Re(n,r,s,e,dr)}function js(){ie(new Q(Ot,Us,"PUBLIC").setMultipleInstances(!0)),K(Qe,Ze,""),K(Qe,Ze,"esm2017")}js();const Ls={apiKey:void 0,authDomain:void 0,projectId:void 0,storageBucket:void 0,messagingSenderId:void 0,appId:void 0},Ms=ht(Ls),$s=Ns(Ms);function Bi(){var Ue,je,Le;const{id:t}=Lt(),e=Mt(),[n,r]=w.useState(null),[s,i]=w.useState(null),[o,c]=w.useState(null),[a,u]=w.useState(!1),[v,x]=w.useState({show:!1,message:""}),[f,y]=w.useState(0),[S,D]=w.useState(0),[_,O]=w.useState({loading:!0,error:null,active:!1}),U=JSON.parse(localStorage.getItem("user")||"{}"),[T,I]=w.useState({}),B=w.useRef(null),R=w.useRef(null),L=w.useRef(null),H=w.useRef(null),Se=w.useRef(!1);async function Te(){try{document.fullscreenElement||await document.documentElement.requestFullscreen()}catch(h){console.warn("Fullscreen request blocked:",h)}}async function Ce(h=null){O({loading:!0,error:null,active:!1});try{const d=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720},facingMode:"user"},audio:!1});return R.current?(R.current.srcObject=d,await new Promise((p,k)=>{R.current.onloadedmetadata=()=>{R.current.play().then(p).catch(k)},setTimeout(()=>k(new Error("Camera timeout")),5e3)}),O({loading:!1,error:null,active:!0}),h&&Nt(h),!0):(d.getTracks().forEach(p=>p.stop()),O({loading:!1,error:"Camera not ready",active:!1}),!1)}catch(d){console.error("Camera initialization error:",d);let p="Failed to access camera. ";return d.name==="NotAllowedError"?p+="Please grant camera permission and refresh the page.":d.name==="NotFoundError"?p+="No camera detected on your device.":d.name==="NotReadableError"?p+="Camera is already in use by another application.":p+=d.message||"Unknown error occurred.",O({loading:!1,error:p,active:!1}),!1}}w.useEffect(()=>(Bt(),Be),[t]);async function Bt(){try{if((await N.get(`/user/attempts/check-completed/${t}`).catch(()=>({data:{completed:!1}}))).data.completed){alert("You have already completed this exam!"),e("/student");return}const d=await N.get(`/user/attempts/my-active/${t}`);if(d.data.attempt){const p=d.data.attempt;c(p),u(!0);const k=await N.get(`/user/exams/${t}`);r(k.data.exam),i(k.data.questions);const z=new Date(p.started_at_server),G=Math.floor((Date.now()-z)/1e3),ee=Math.max(p.allowed_duration-G,0);D(ee),De(ee)}}catch(h){console.error("Init failed:",h),e("/login")}}async function Ae(){try{await Te();const h=await N.post(`/user/attempts/start/${t}`);let d=null;for(let z=0;z<5;z++){const G=await N.get(`/user/attempts/my-active/${t}`);if(G.data.attempt){d=G.data.attempt;break}await new Promise(ee=>setTimeout(ee,300))}if(!d){alert("Attempt not created properly. Try again.");return}c(d),u(!0);const p=await N.get(`/user/exams/${t}`);r(p.data.exam),i(p.data.questions);const k=d.allowed_duration||p.data.exam.duration_minutes*60;D(k),De(k)}catch(h){console.error(h),alert("Failed to start exam: "+(h.message||"Unknown error"))}}w.useEffect(()=>{!a||!(o!=null&&o.id)||Se.current||(Se.current=!0,Ce(o.id))},[a,o]);function De(h){B.current&&clearInterval(B.current);let d=Math.max(h,0);D(d),B.current=setInterval(()=>{if(d=d-1,d<=0){clearInterval(B.current),d=0,D(0),Ne(!0);return}D(d)},1e3)}function Nt(h){H.current=setInterval(async()=>{if(!(!L.current||!R.current||R.current.videoWidth===0))try{const d=L.current.getContext("2d");L.current.width=R.current.videoWidth,L.current.height=R.current.videoHeight,d.drawImage(R.current,0,0);const p=L.current.toDataURL("image/jpeg",.7),k=`exam-monitoring/${U.id}/${h}/${Date.now()}.jpg`,z=Bs($s,k);await ks(z,p,"data_url");const G=await Os(z);await N.post(`/user/attempts/${h}/snapshot-url`,{imageUrl:G}).catch(()=>{})}catch(d){console.error(d)}},3e4)}const[ke,Oe]=w.useState("");w.useEffect(()=>{if(!a)return;function h(){document.fullscreenElement||(Oe("⚠️ Not allowed! Returning to fullscreen…"),Te(),o!=null&&o.id&&N.post(`/user/attempts/${o.id}/violation`,{type:"fullscreen_exit",severity:"high",timestamp:new Date().toISOString()}).catch(()=>{}),setTimeout(()=>Oe(""),3e3))}return document.addEventListener("fullscreenchange",h),()=>document.removeEventListener("fullscreenchange",h)},[a,o]),w.useEffect(()=>{if(!a)return;function h(){document.hidden&&(o!=null&&o.id)&&N.post(`/user/attempts/${o.id}/violation`,{type:"tab_switch_or_minimize",severity:"medium",timestamp:new Date().toISOString()}).catch(()=>{})}return document.addEventListener("visibilitychange",h),()=>document.removeEventListener("visibilitychange",h)},[a,o]);function Be(){var h;B.current&&clearInterval(B.current),H.current&&clearInterval(H.current),(h=R.current)!=null&&h.srcObject&&R.current.srcObject.getTracks().forEach(d=>d.stop())}async function Ne(h=!1){if(o)try{const d=Object.entries(T);for(const[p,k]of d)await N.post(`/user/attempts/${o.id}/answer`,{questionId:p,answerPayload:k}).catch(()=>{});await N.post(`/user/attempts/${o.id}/submit`),Be(),document.fullscreenElement&&await document.exitFullscreen(),alert(h?"Time up. Submitted.":"Exam Submitted"),e("/student")}catch(d){console.error("Submit failed:",d),alert("Submit failed")}}function Pe(h,d){I(p=>({...p,[h]:{...p[h],...d}}))}if(!a&&!n)return l.jsx("div",{style:et,children:l.jsxs("div",{style:tt,children:[l.jsx("h1",{children:"Exam"}),l.jsx("button",{onClick:Ae,style:nt,children:"Begin Exam"})]})});if(!a)return l.jsx("div",{style:et,children:l.jsxs("div",{style:tt,children:[l.jsx("h1",{children:n.title}),l.jsx("button",{onClick:Ae,style:nt,children:"Begin Exam"})]})});if(!s)return l.jsx("div",{children:"Loading..."});const E=s[f],Pt=Math.floor(S/60),Ut=S%60,jt=(f+1)/s.length*100;return l.jsxs(l.Fragment,{children:[l.jsx("style",{children:`
        /* Custom scrollbar for question navigator */
        .question-navigator-grid::-webkit-scrollbar {
          width: 6px;
        }
        .question-navigator-grid::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .question-navigator-grid::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .question-navigator-grid::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}),l.jsxs("div",{style:Fs,children:[l.jsxs("div",{style:Hs,children:[l.jsxs("div",{style:zs,children:[l.jsx("h2",{style:Ws,children:n.title}),l.jsxs("div",{style:Vs,children:["Question ",f+1," of ",s.length]})]}),l.jsxs("div",{style:qs,children:[l.jsxs("div",{style:Gs,children:[l.jsx($t,{size:20}),l.jsxs("span",{style:Ks,children:[String(Pt).padStart(2,"0"),":",String(Ut).padStart(2,"0")]})]}),l.jsxs("button",{onClick:()=>Ne(!1),style:Xs,children:[l.jsx(Ft,{size:18})," Submit Exam"]})]})]}),ke&&l.jsx("div",{style:{background:"#fee2e2",color:"#991b1b",padding:"10px 16px",borderRadius:8,fontWeight:600,textAlign:"center",margin:"10px 20px"},children:ke}),l.jsx("div",{style:Js,children:l.jsx("div",{style:{...Ys,width:`${jt}%`}})}),l.jsxs("div",{style:Qs,children:[l.jsxs("div",{style:Zs,children:[l.jsxs("div",{style:ei,children:[l.jsxs("div",{style:ti,children:[l.jsxs("span",{style:ni,children:["Q",f+1]}),l.jsx("span",{style:ri,children:((Ue=E.question_type)==null?void 0:Ue.toUpperCase())||"MCQ"}),l.jsxs("span",{style:si,children:[E.marks||E.points||1," ","points"]})]}),l.jsx("p",{style:ii,children:E.question_text||((je=E.content)==null?void 0:je.prompt)||E.content}),l.jsxs("div",{style:oi,children:[(E.question_type==="mcq"||E.type==="mcq")&&l.jsx("div",{style:ai,children:(E.options||E.choices||[]).map((h,d)=>{var p;return l.jsxs("label",{style:ci,children:[l.jsx("input",{type:"radio",name:`question-${E.id}`,checked:((p=T[E.id])==null?void 0:p.choice)===d,onChange:()=>Pe(E.id,{choice:d}),style:li}),l.jsx("span",{style:ui,children:h})]},d)})}),E.question_type!=="mcq"&&E.type!=="mcq"&&l.jsx("textarea",{rows:12,placeholder:"Write your code here...",value:((Le=T[E.id])==null?void 0:Le.code)||"",onChange:h=>Pe(E.id,{code:h.target.value}),style:di})]})]}),l.jsxs("div",{style:hi,children:[l.jsxs("button",{disabled:f===0,onClick:()=>y(h=>h-1),style:f===0?st:rt,children:[l.jsx(Ht,{size:20}),"Previous"]}),l.jsxs("button",{disabled:f===s.length-1,onClick:()=>y(h=>h+1),style:f===s.length-1?st:rt,children:["Next",l.jsx(zt,{size:20})]})]})]}),l.jsxs("div",{style:fi,children:[l.jsxs("div",{style:pi,children:[l.jsxs("div",{style:gi,children:[l.jsx(Wt,{size:16}),l.jsx("span",{children:"Camera Feed"}),_.active&&l.jsxs("span",{style:Ii,children:[l.jsx("span",{style:Ri})," LIVE"]})]}),_.loading&&l.jsxs("div",{style:Si,children:[l.jsx(Vt,{size:48,color:"#94a3b8"}),l.jsx("p",{style:Ti,children:"Initializing camera..."})]}),_.error&&!_.loading&&l.jsxs("div",{style:Ci,children:[l.jsx(qt,{size:48,color:"#ef4444"}),l.jsx("p",{style:Ai,children:_.error}),l.jsx("button",{onClick:()=>Ce(o==null?void 0:o.id),style:Di,children:"Retry Camera"})]}),l.jsx("video",{ref:R,autoPlay:!0,playsInline:!0,muted:!0,style:{...mi,display:_.active?"block":"none",transform:"scaleX(-1)"}}),l.jsx("canvas",{ref:L,hidden:!0}),l.jsx("p",{style:bi,children:"Your session is being monitored"})]}),l.jsxs("div",{style:_i,children:[l.jsx("h4",{style:yi,children:"Question Navigator"}),l.jsx("div",{className:"question-navigator-grid",style:wi,children:s.map((h,d)=>l.jsx("button",{onClick:()=>y(d),style:{...xi,...d===f?Ei:{},...T[h.id]?vi:{}},children:d+1},h.id))})]})]})]})]})]})}const et={minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #1f4cac 20%, #e86819 100%)",padding:"40px"},tt={background:"#ffffff",borderRadius:24,padding:48,maxWidth:600,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",textAlign:"center"},nt={width:"100%",padding:"16px 32px",background:"linear-gradient(155deg,rgba(248, 248, 248, 0.66) 10%,rgba(159, 158, 157, 0.99) 100%)",color:"#020914",border:"line",borderRadius:15,fontSize:16,fontWeight:600,cursor:"pointer",boxShadow:"10px 10px 25px rgba(102, 126, 234, 0.4)",transition:"all 0.1s"},Fs={minHeight:"100vh",background:"#f8fafc",display:"flex",flexDirection:"column"},Hs={background:"#ffffff",padding:"20px 40px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100},zs={display:"flex",alignItems:"center",gap:24},Ws={fontSize:20,fontWeight:700,color:"#0f172a",margin:0},Vs={fontSize:14,color:"#64748b",padding:"6px 12px",background:"#f1f5f9",borderRadius:8},qs={display:"flex",alignItems:"center",gap:16},Gs={display:"flex",alignItems:"center",gap:10,padding:"10px 20px",background:"#fef3c7",borderRadius:12,color:"#92400e",fontSize:18,fontWeight:600},Ks={fontFamily:"monospace"},Xs={display:"flex",alignItems:"center",gap:8,padding:"12px 24px",background:"#10b981",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",transition:"all 0.3s"},Js={height:4,background:"#e2e8f0",position:"relative"},Ys={height:"100%",background:"linear-gradient(90deg, #667eea 0%, #764ba2 100%)",transition:"width 0.3s"},Qs={flex:1,display:"flex",gap:24,padding:40,maxWidth:1600,margin:"0 auto",width:"100%"},Zs={flex:1,display:"flex",flexDirection:"column",gap:24},ei={background:"#ffffff",borderRadius:20,padding:32,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",flex:1},ti={display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingBottom:16,borderBottom:"2px solid #f1f5f9"},ni={fontSize:16,fontWeight:700,color:"#fff",background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",padding:"6px 14px",borderRadius:8},ri={fontSize:12,fontWeight:600,color:"#64748b",padding:"6px 12px",background:"#f1f5f9",borderRadius:6},si={fontSize:12,fontWeight:600,color:"#10b981",padding:"6px 12px",background:"#d1fae5",borderRadius:6,marginLeft:"auto"},ii={fontSize:16,color:"#0f172a",lineHeight:1.8,marginBottom:24},oi={marginTop:24},ai={display:"flex",flexDirection:"column",gap:12},ci={display:"flex",alignItems:"center",gap:12,padding:16,background:"#f8fafc",borderRadius:12,cursor:"pointer",border:"2px solid transparent",transition:"all 0.3s"},li={width:20,height:20,accentColor:"#667eea"},ui={fontSize:15,color:"#0f172a",flex:1},di={width:"100%",padding:16,fontSize:14,fontFamily:"monospace",border:"2px solid #e2e8f0",borderRadius:12,resize:"vertical",outline:"none"},hi={display:"flex",gap:16,justifyContent:"space-between"},rt={flex:1,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#667eea",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",transition:"all 0.3s"},st={flex:1,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#e2e8f0",color:"#94a3b8",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:"not-allowed"},fi={width:320,display:"flex",flexDirection:"column",gap:24,position:"sticky",top:20,alignSelf:"flex-start",maxHeight:"calc(100vh - 40px)"},pi={background:"#ffffff",borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",flexShrink:0},gi={display:"flex",alignItems:"center",gap:8,marginBottom:12,fontSize:14,fontWeight:600,color:"#0f172a"},mi={width:"100%",borderRadius:12,background:"#1e293b",aspectRatio:"4/3",objectFit:"cover"},bi={fontSize:11,color:"#94a3b8",textAlign:"center",marginTop:8},_i={background:"#ffffff",borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",display:"flex",flexDirection:"column",flex:1,minHeight:0},yi={fontSize:14,fontWeight:600,color:"#0f172a",marginBottom:16,flexShrink:0},wi={display:"grid",gridTemplateColumns:"repeat(5, 1fr)",gap:8,overflowY:"auto",paddingRight:8,maxHeight:"400px"},xi={width:"100%",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc",border:"2px solid #e2e8f0",borderRadius:8,fontSize:13,fontWeight:600,color:"#64748b",cursor:"pointer",transition:"all 0.3s"},Ei={background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",color:"#fff",borderColor:"#667eea"},vi={background:"#d1fae5",borderColor:"#10b981",color:"#15803d"},Ii={marginLeft:"auto",display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,color:"#ef4444",padding:"4px 8px",background:"#fee2e2",borderRadius:6},Ri={width:6,height:6,borderRadius:"50%",background:"#ef4444",animation:"pulse 2s infinite"},Si={width:"100%",aspectRatio:"4/3",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#f1f5f9",borderRadius:12,gap:12},Ti={fontSize:13,color:"#64748b",margin:0},Ci={width:"100%",aspectRatio:"4/3",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#fef2f2",borderRadius:12,gap:12,padding:20},Ai={fontSize:12,color:"#991b1b",margin:0,textAlign:"center",lineHeight:1.5},Di={padding:"8px 16px",background:"#ef4444",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",marginTop:8};export{Bi as default};
//# sourceMappingURL=ExamPage-CtXqU5O5.js.map
