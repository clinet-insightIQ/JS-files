const profilePrefix="profile-data",Selectors={profilePicture:"[profile-data=profile-picture]",fullname:"[profile-data=fullname]",username:"[profile-data=username]",profileLink:"[profile-data=profile-link]",profileVerified:"[profile-data=is-verified]",profileCopyLink:"[profile-data=copy-link]",popupImage:"[profile-data=popup-image]",popupUsername:"[profile-data=popup-username]",engagementRate:"[profile-data=eng-rate]",medianER:"[profile-data=median-er]",highLowThan:"[profile-data=higher-lower]",ERTagBgColor:"[profile-data=er-tag-bgColor]",followers:"[profile-data=followers]",avgLikes:"[profile-data=avg-likes]",avgComments:"[profile-data=avg-comments]",TabsWrapper:"[profile-data=tabs-wrapper]",ContentWrapperTab1:"[profile-data=content-wrapper-1]",ContentWrapperTab2:"[profile-data=content-wrapper-2]",ContentWrapperTab3:"[profile-data=content-wrapper-3]",SampleHeader:"[profile-data=sample-header]",ContentCardTab1:"[tab-1-item=card]",ContentCardTab2:"[tab-2-item=card]",ContentCardTab3:"[tab-3-item=card]",CardDate:"[card-item=date]",CardImage:"[card-item=image]",CardDesc:"[card-item=description]",CardLikes:"[card-item=likes]",CardComments:"[card-item=comments]",CardER:"[card-item=eng-rate]",CardPP:"[card-item=dp]",AutocompleteLoader:"[input-data=loader-dots]",ButtonLoader:"[input-data=btn-loader]",MainLoader:"[input-data=main-loader]",HeroWrapper:"[input-data=hero-wrapper]",NoSponsoredContent:"[input-data=no-sponsored-content]",NoProfileData:"[input-data=no-profile-data]",MainHeroSection:"[input-data=main-hero-section]",HeaderUsername:"[profile-data=header-username]",placeholderTitle:"[profile-data=placeholder-title]",mainSpinner:"[profile-data=main-spinner]",analyseProfile:"[profile-data=analyze-full-profile]"};let HeadingColor="#13144d",TextColorWhite="#ffffff",UsernameColor="#121b2e",HeaderTitle="Engagement rate for";const searchInput=document.querySelector("[input-data=query]"),submitButton=document.querySelector("[input-btn=check-profile]"),autocompleteLoaderEle=document.querySelector(Selectors.AutocompleteLoader),buttonLoaderEle=document.querySelector(Selectors.ButtonLoader),SampleHeaderEle=document.querySelector(Selectors.SampleHeader),HeroAreaEle=document.querySelector(Selectors.HeroWrapper),copyLinkEle=document.querySelector(Selectors.profileCopyLink),MainHeroSectionEle=document.querySelector(Selectors.MainHeroSection),NoProfileDateEle=document.querySelector(Selectors.NoProfileData),NoSponsoredContentEle=document.querySelector(Selectors.NoSponsoredContent),SampleHeaderUsernameEle=document.querySelector(Selectors.HeaderUsername),placeholderTitleEle=document.querySelector(Selectors.placeholderTitle),mainSpinnerEle=document.querySelector(Selectors.mainSpinner),ERTagBgColorEle=document.querySelector(Selectors.ERTagBgColor),analyseProfileButton=document.querySelector(Selectors.analyseProfile),resultList=document.querySelector("[data=result-list]"),listItem=document.querySelector("[data=list-item]"),listItemImgAttr="[data=item-image]",listItemNameAttr="[data=list-item-name]",listItemUsernameAttr="[data=list-item-username]",listItemIsVerifiedAttr="[data=item-is-verified]",Search_URL="https://insightiq-api.nrj.life/search?",fetchResults=debounce((async e=>{const t=new URL(Search_URL);t.searchParams.set("q",e.query),t.searchParams.set("p",e.platform||"it"),TrackEvent(EventNames.erUserNameEntered,{username:e.query,platform_name:"instagram"});try{const r=await(await fetch(t,{method:"GET"})).json();return e.onSuccess(r),r}catch(e){}}),500),fetchProfileInfo=async e=>{const t=new URL("https://insightiq-api.nrj.life/engagement-data");let r;t.searchParams.set("h",e.handle),t.searchParams.set("p",e.platform||"it");try{r=await fetch(t),r.ok&&(r=await r.json())}catch(e){return e}return r};let currentHandle,timeId=null,searchedProfile={};const handleTextChange=async e=>{autocompleteLoaderEle.style.display="block";const t=e.target.value;searchInput.value;if(currentHandle=t,!t||!t.length)return autocompleteLoaderEle.style.display="none",void(resultList.innerHTML="");fetchResults({query:t,onSuccess:e=>{autocompleteLoaderEle.style.display="none",t.length&&e&&e.data.length?(resultList.innerHTML="",e.data.forEach((e=>{const t=listItem.cloneNode(!0),r=t.querySelector(listItemImgAttr),a=t.querySelector(listItemNameAttr),n=t.querySelector(listItemUsernameAttr),o=t.querySelector(listItemIsVerifiedAttr);r.src=e.picture,r.alt=`${e.fullname}'s image`,a.innerText=e.fullname,n.innerText=`@${e.username}`,e.is_verified||(o.style.display="none"),t.addEventListener("click",(()=>{searchInput.value=e.username,currentHandle=e.username,resultList.style.display="none",updateBrowserUrl(),handleUsernameSubmit(),TrackEvent(EventNames.erProfileSelected,{username:e.username,platform_name:"instagram"})})),resultList.appendChild(t)})),resultList.style.zIndex=10,resultList.style.display="flex"):resultList.innerHTML="<div> No results found </div>"}})},formatDateTime=(e=new Date)=>new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!0}).format(e),formatDate=(e=new Date)=>new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short",year:"2-digit"}).format(e);let chart1,chart2,chart3;const updateGraphs=e=>{const{latest:t,top:r,sponsored:a}=e,n=document.getElementById("bar-chart-latest"),o=document.getElementById("bar-chart-top"),l=document.getElementById("bar-chart-sponsored");chart1&&chart2&&chart3&&(chart1.destroy(),chart2.destroy(),chart3.destroy()),chart1=renderBarGraphs({ref:n,yAxisData:t.engagementRates,xAxisData:t.publishedDates.map((e=>formatDate(new Date(e))))}),chart2=renderBarGraphs({ref:o,yAxisData:r.engagementRates,xAxisData:r.publishedDates.map((e=>formatDate(new Date(e))))}),chart3=renderBarGraphs({ref:l,yAxisData:a.engagementRates,xAxisData:a.publishedDates.map((e=>formatDate(new Date(e))))})};function replaceImageWithVideo(e,t){const r=document.createElement("video");r.src=t.url,r.width=t.width||"300",r.height=t.height||"200",r.className=t.className||"image",e.replaceWith(r)}function updateTabContent(e,t,r){let a,n;const o=document.querySelector(Selectors.ContentWrapperTab1),l=document.querySelector(Selectors.ContentWrapperTab2),i=document.querySelector(Selectors.ContentWrapperTab3),s=document.querySelector(Selectors.ContentCardTab1),c=document.querySelector(Selectors.ContentCardTab2),d=document.querySelector(Selectors.ContentCardTab3);"top"===e&&(a=l,n=c),"latest"===e&&(a=o,n=s),"sponsored"===e&&(a=i,n=d),t&&t.length?(a.innerHTML="",t.forEach((e=>{const t=n?.cloneNode(!0);if(!t)return;const o=t.querySelector(Selectors.CardPP),l=t.querySelector(Selectors.CardDate),i=t.querySelector(Selectors.CardImage),s=t.querySelector(Selectors.CardDesc),c=t.querySelector(Selectors.CardLikes),d=t.querySelector(Selectors.CardComments),p=t.querySelector(Selectors.CardER);o.src=r,o.srcset="",l.innerText=formatDateTime(new Date(e.published_at)),e.thumbnail_url?(i.src=e.thumbnail_url,i.srcset=""):(i.src="https://i.stack.imgur.com/drHbk.jpg",i.srcset=""),s.innerText=e.description,e.engagementRate?p.innerText=`${e.engagementRate?.toFixed(1)}%`:p.parentElement.style.dsiplay="none",c.innerText=e.engagement.like_count||"",d.innerText=e.engagement.comment_count||"",t.addEventListener("click",(()=>window.open(e.url,"blank"))),a.appendChild(t)}))):(a.innerHTML="",NoSponsoredContentEle.style.display="flex")}const updateProfilePage=e=>{NoProfileDateEle.style.display="none",MainHeroSectionEle.style.display="block",mainSpinnerEle.style.display="none";const t=document.querySelector(Selectors.profilePicture),r=document.querySelector(Selectors.fullname),a=document.querySelector(Selectors.profileVerified),n=document.querySelector(Selectors.username),o=document.querySelector(Selectors.profileLink),l=document.querySelector(Selectors.popupImage),i=document.querySelector(Selectors.popupUsername),s=document.querySelector(Selectors.engagementRate),c=document.querySelector(Selectors.medianER),d=document.querySelector(Selectors.highLowThan),p=document.querySelector(Selectors.followers),u=document.querySelector(Selectors.avgLikes),m=document.querySelector(Selectors.avgComments);if(e&&Object.keys(e).length>1){const{profile:f,stats:y,posts:h,graphs:g}=e;f&&(t.src=f.imageUrl,r.innerText=f.fullName,n.innerText=f.username,l.src=f.imageUrl,i.innerText=f.username,f.isVerified||(a.style.display="none"),o.addEventListener("click",(()=>window.open(f.url,"blank"))),copyLinkEle.addEventListener("click",(()=>{generateCopyUrl(currentHandle,(()=>{copyLinkEle.innerText="Copied!",setTimeout((()=>{copyLinkEle.innerText="Copy profile link"}),1500)}),(()=>{copyLinkEle.innerText="Failed to Copy!"}))}))),y&&(s.innerText=`${y.engagementRate}%`,d.innerText="",c.innerText=`${y.engagementTag}`,ERTagBgColorEle.style.backgroundColor=`${y.engTagColor}`,p.innerText=y.followers||"",u.innerText=y.averageLikes||"",m.innerText=y.averageComments||"",ERTagBgColorEle.addEventListener("click",(()=>{TrackEvent(EventNames.erContentTag,{username:f.username,platform_name:"instagram",er_value:y.engagementTag})}))),h&&(updateTabContent("top",h.topContent,f.imageUrl),updateTabContent("sponsored",h.sponseredContent,f.imageUrl)),g&&updateGraphs(g)}else SampleHeaderUsernameEle.style.color=UsernameColor,SampleHeaderUsernameEle.innerText=`@${currentHandle}`,MainHeroSectionEle.style.display="none",NoProfileDateEle.style.display="flex",mainSpinnerEle.style.display="none"},handleUsernameSubmit=async e=>{if(e?.preventDefault(),submitButton.style.color=HeadingColor,buttonLoaderEle.style.display="block",resultList.innerHTML="",copyLinkEle.innerText="Copy profile link",!currentHandle||!currentHandle.length)return submitButton.style.color=TextColorWhite,void(buttonLoaderEle.style.display="none");const t=await fetchProfileInfo({handle:currentHandle});placeholderTitleEle.style.opacity=1,updateProfilePage(t),buttonLoaderEle.style.display="none",submitButton.style.color=TextColorWhite,window.location.href.includes("profile")&&(SampleHeaderEle.innerText=`${HeaderTitle} `,SampleHeaderUsernameEle.style.color=UsernameColor,SampleHeaderUsernameEle.innerText=`@${currentHandle}`)},generateCopyUrl=(e,t,r)=>{const a=new URL(`${window.location.href}`);var n;a.searchParams.set("profile",e),n=a,navigator.clipboard.writeText(n).then((()=>{t()}),(()=>{r()}))},updateBrowserUrl=()=>{if(!currentHandle||!currentHandle.length)return;const e=new URL(`${window.location.href}`);""!==currentHandle&&e.searchParams.set("profile",currentHandle),window.history.pushState(null,null,`?profile=${currentHandle}`)},updateAppState=e=>{currentHandle=e,handleUsernameSubmit()};function debounce(e,t=300){let r;return(...a)=>{clearTimeout(r),r=setTimeout((()=>e(...a)),t)}}function renderBarGraphs(e){const t=e.xAxisData?.map((e=>{const[t,r,a]=e.split("-");return`${t} ${r} '${a}`}));return new window.Chart(e.ref,{type:"bar",data:{labels:t,datasets:[{backgroundColor:new Array(10).fill("#00D176"),data:e.yAxisData}]},options:{plugins:{tooltip:{enabled:!0,displayColors:!1,callbacks:{title:function(e){return""},label:function(e){let t="";if(null!==e.parsed.y){t+=`${e.parsed.y<.01?e.parsed.y?.toFixed(3):e.parsed.y?.toFixed(2)}%`}return t}}},legend:{display:!1},responsive:!0,title:{display:!0,text:"Date Posted",position:"bottom",font:{weight:700,size:14}}},scales:{y:{border:{dash:[5,5]},ticks:{color:"#333",font:{weight:700},callback:function(e,t,r){return e+"%"}}},x:{grid:{display:!1},ticks:{font:{weight:700}}}},animation:!1}})}searchInput.addEventListener("input",handleTextChange),submitButton.addEventListener("click",(()=>{TrackEvent(EventNames.erCheckProfileClicked,{username:currentHandle,platform_name:"instagram"}),handleUsernameSubmit()})),HeroAreaEle.addEventListener("click",(e=>{resultList.hasChildNodes&&(resultList.style.display="none")})),analyseProfileButton.addEventListener("click",(()=>{TrackEvent(EventNames.erFullProfile,{username:currentHandle,platform_name:"instagram"})})),window.addEventListener("load",(e=>{const t=new URL(window.location.href).searchParams.get("profile");updateAppState(t),searchInput.value=t,t||updateAppState("emmachamberlain")})),window.mixpanel.init("57d1ea6085714f5117a2c1bd6b2615c2",{debug:!0,track_pageview:!0,persistence:"localStorage"});const EventNames={erUserNameEntered:"ER_USERNAME_ENTERED",erCheckProfileClicked:"ER_CHECK_PROFILE_CLICKED",erFullProfile:"ER_FULL_PROFILE_ANALYSED",erContentTag:"ER_ENGAGEMENT_CONTENT_TAG_CLICKED",erProfileSelected:"ER_PROFILE_SELECTED"},TrackEvent=(e,t)=>{window.mixpanel.track(e,t)};$(".slider-microapp_component").each((function(e){let t=!1;"true"===$(this).attr("loop-mode")&&(t=!0);let r=300;void 0!==$(this).attr("slider-duration")&&(r=+$(this).attr("slider-duration"));new Swiper($(this).find(".swiper")[0],{speed:r,loop:t,autoHeight:!1,centeredSlides:t,followFinger:!0,freeMode:!1,slideToClickedSlide:!1,slidesPerView:1,spaceBetween:"4%",rewind:!1,mousewheel:{forceToAxis:!0},keyboard:{enabled:!0,onlyInViewport:!0},breakpoints:{480:{slidesPerView:1,spaceBetween:"4%"},768:{slidesPerView:2,spaceBetween:"4%"},992:{slidesPerView:3,spaceBetween:"2%"}},pagination:{el:$(this).find(".swiper-bullet-wrapper")[0],bulletActiveClass:"is-active",bulletClass:"swiper-bullet",bulletElement:"button",clickable:!0},navigation:{nextEl:$(this).find(".swiper-next")[0],prevEl:$(this).find(".swiper-prev")[0],disabledClass:"is-disabled"},scrollbar:{el:$(this).find(".swiper-drag-wrapper")[0],draggable:!0,dragClass:"swiper-drag",snapOnRelease:!0},slideActiveClass:"is-active",slideDuplicateActiveClass:"is-active"})}));