(this.webpackJsonprater=this.webpackJsonprater||[]).push([[0],{118:function(e,t,a){e.exports=a(219)},152:function(e,t,a){},153:function(e,t,a){},214:function(e,t,a){},219:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(17),c=a.n(r),s=a(82),o=a(14),i=a(8),d=a(26),u=a(18),m=a(47),E=a.n(m),p=a(53),g=a(10),b=a(110),f=a.n(b),v=(a(152),a(48)),h=a(112),O=a(49),_=a(41),y=a(117),S=(a(153),function(e,t){return function(a){return a[e]===t}}),j=function(e){var t=Object(n.useState)(null===e.user_feedback_label_name?"Is this ad problematic?":e.user_feedback_label_name),a=Object(i.a)(t,2),r=a[0],c=a[1],s=function(t){E.a.post("/ad-feedback/"+e.ad_cluster_id+"/set-label/"+t).then((function(e){console.log(e.data),c(t)})).catch((function(t){console.log(t),t.response&&401===t.response.status&&e.handleShowNeedLoginModal()})).finally((function(){}))};return l.a.createElement(h.a,{className:"problematic-ad-button",id:"dropdown-basic-button",title:r},["(No Answer)","No","Misinformation","Scam","Other","Miscategorized"].map((function(t){return l.a.createElement(v.a.Item,{href:"#",key:e.ad_cluster_id+t,eventKey:t,onSelect:s},t)})))},N=function(e){if(!e.details||0===e.details.length)return l.a.createElement("div",null);var t=e.details.demo_impression_results.filter(S("gender","female"));t.sort((function(e,t){return e.age_group>t.age_group?1:-1}));var a=e.details.demo_impression_results.filter(S("gender","male"));a.sort((function(e,t){return e.age_group>t.age_group?1:-1}));var n=e.details.demo_impression_results.filter(S("gender","unknown"));n.sort((function(e,t){return e.age_group>t.age_group?1:-1}));var r="https://www.facebook.com/ads/library/?id="+e.details.canonical_archive_id,c=e.details.region_impression_results;return c.sort((function(e,t){return e.region>t.region?1:-1})),l.a.createElement(u.a,{show:e.show,onHide:e.handleClose,dialogClassName:"modal-90w",size:"xl"},l.a.createElement(u.a.Header,null,l.a.createElement(u.a.Title,null,"Cluster ID: ",e.details.ad_cluster_id)),l.a.createElement(u.a.Body,null,l.a.createElement(y.a,{defaultActiveKey:"demos"},l.a.createElement(O.a,{eventKey:"demos",title:"Total Demographic Spend",mountOnEnter:!0},l.a.createElement("h3",null,"Female"),l.a.createElement(_.a,{striped:!0,bordered:!0,hover:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Age Group"),l.a.createElement("th",null,"Max Spend"),l.a.createElement("th",null,"Max Impressions"))),l.a.createElement("tbody",null,t.map((function(e){return l.a.createElement("tr",{key:e.age_group},l.a.createElement("td",null,e.age_group),l.a.createElement("td",null,e.max_spend),l.a.createElement("td",null,e.max_impressions))})))),l.a.createElement("h3",null,"Male"),l.a.createElement(_.a,{striped:!0,bordered:!0,hover:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Age Group"),l.a.createElement("th",null,"Max Spend"),l.a.createElement("th",null,"Max Impressions"))),l.a.createElement("tbody",null,a.map((function(e){return l.a.createElement("tr",{key:e.age_group},l.a.createElement("td",null,e.age_group),l.a.createElement("td",null,e.max_spend),l.a.createElement("td",null,e.max_impressions))})))),l.a.createElement("h3",null,"Unknown"),l.a.createElement(_.a,{striped:!0,bordered:!0,hover:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Age Group"),l.a.createElement("th",null,"Max Spend"),l.a.createElement("th",null,"Max Impressions"))),l.a.createElement("tbody",null,n.map((function(e){return l.a.createElement("tr",{key:e.age_group},l.a.createElement("td",null,e.age_group),l.a.createElement("td",null,e.max_spend),l.a.createElement("td",null,e.max_impressions))}))))),l.a.createElement(O.a,{eventKey:"regional",title:"Total Regional Spend",mountOnEnter:!0},l.a.createElement(_.a,{striped:!0,bordered:!0,hover:!0},l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Region"),l.a.createElement("th",null,"Max Spend"),l.a.createElement("th",null,"Max Impressions"))),l.a.createElement("tbody",null,c.map((function(e){return l.a.createElement("tr",{key:e.region},l.a.createElement("td",null,e.region),l.a.createElement("td",null,e.max_spend),l.a.createElement("td",null,e.max_impressions))}))))),l.a.createElement(O.a,{eventKey:"alternates",title:"Alternate Creatives",mountOnEnter:!0},e.details.alternative_ads.map((function(e){return l.a.createElement("div",{className:"ad-image-container",key:e},l.a.createElement("img",{alt:e,src:"https://storage.googleapis.com/facebook_ad_archive_screenshots/"+e+".png"}))}))),l.a.createElement(O.a,{eventKey:"metadata",title:"NYU Metadata",mountOnEnter:!0},l.a.createElement(_.a,{striped:!0,bordered:!0,hover:!0},l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",null,"Ad Type:"),l.a.createElement("td",null,e.details.type)),l.a.createElement("tr",null,l.a.createElement("td",null,"Entities:"),l.a.createElement("td",null,e.details.entities)),l.a.createElement("tr",null,l.a.createElement("td",null,"Cluster Topics:"),l.a.createElement("td",null,e.details.topics)),l.a.createElement("tr",null,l.a.createElement("td",null,"Number of ads in cluster:"),l.a.createElement("td",null,e.details.cluster_size)),l.a.createElement("tr",null,l.a.createElement("td",null,"Canonical ad archive ID:"),l.a.createElement("td",null,e.details.canonical_archive_id))))),l.a.createElement(O.a,{eventKey:"advertiser_info",title:"Advertiser Metadata",mountOnEnter:!0},l.a.createElement(_.a,{striped:!0,bordered:!0,hover:!0},l.a.createElement("tbody",null,l.a.createElement("tr",null,l.a.createElement("td",null,"Advertiser Type:"),l.a.createElement("td",null,e.details.advertiser_info.advertiser_type)),l.a.createElement("tr",null,l.a.createElement("td",null,"Advertiser Party:"),l.a.createElement("td",null,e.details.advertiser_info.advertiser_party)),l.a.createElement("tr",null,l.a.createElement("td",null,"FEC ID:"),l.a.createElement("td",null,e.details.advertiser_info.advertiser_fec_id)),l.a.createElement("tr",null,l.a.createElement("td",null,"Advertiser website:"),l.a.createElement("td",null,e.details.advertiser_info.advertiser_webiste)),l.a.createElement("tr",null,l.a.createElement("td",null,"Risk Score:"),l.a.createElement("td",null,e.details.advertiser_info.advertiser_risk_score))))))),l.a.createElement(u.a.Footer,null,l.a.createElement(d.a,{className:"right",href:r,target:"_blank",rel:"noopener noreferrer"},"See in Facebook Ad Library")," ",l.a.createElement(d.a,{variant:"secondary",onClick:e.handleClose},"Close")))},k=function(e){var t=Object(n.useState)(!1),a=Object(i.a)(t,2),r=a[0],c=a[1],s=Object(n.useState)([]),o=Object(i.a)(s,2),u=o[0],m=o[1],p=Object(n.useState)(e.ad.url),g=Object(i.a)(p,2),b=g[0],f=g[1],v=function(e){E.a.get("/getaddetails/"+e).then((function(e){console.log(e.data),m(e.data),c(!0)})).catch((function(e){console.log(e)})).finally((function(){}))};return l.a.createElement("div",{className:"ad-container"},l.a.createElement("div",{className:"ad-summary"},l.a.createElement("div",{className:"ad-summary-block-1"},l.a.createElement("div",{className:"ad-summary-tuple"},l.a.createElement("div",{className:"ad-summary-field"},"First seen:"),l.a.createElement("div",{className:"ad-summary-field"},"Last seen:"),l.a.createElement("div",{className:"ad-summary-field"},"Cluster Size:")),l.a.createElement("div",{className:"ad-summary-tuple"},l.a.createElement("div",{className:"ad-summary-data"},e.ad.start_date),l.a.createElement("div",{className:"ad-summary-data"},e.ad.end_date),l.a.createElement("div",{className:"ad-summary-data"},e.ad.cluster_size))),l.a.createElement("div",{className:"ad-summary-block-2"},l.a.createElement("div",{className:"ad-summary-spend"},l.a.createElement("div",{className:"ad-summary-field"},"Estimated Total Spend:"),l.a.createElement("div",{className:"ad-summary-field"},"Estimated Total Impressions:"),l.a.createElement("div",{className:"ad-summary-field"},"Number of pages:")),l.a.createElement("div",{className:"ad-summary-spend"},l.a.createElement("div",{className:"ad-summary-data"},e.ad.total_spend),l.a.createElement("div",{className:"ad-summary-data"},e.ad.total_impressions),l.a.createElement("div",{className:"ad-summary-data"},e.ad.num_pages)))),l.a.createElement(d.a,{variant:"primary",onClick:function(){return v(e.ad.ad_cluster_id)}},"Ad Details"),l.a.createElement(j,{ad_cluster_id:e.ad.ad_cluster_id,handleShowNeedLoginModal:e.handleShowNeedLoginModal,user_feedback_label_name:e.ad.user_feedback_label_name}),l.a.createElement(N,{show:r,handleClose:function(){return c(!1)},details:u,key:u.ad_cluster_id}),l.a.createElement("div",{className:"ad-image-container"},l.a.createElement("img",{className:"ad-image",alt:b,src:b,onError:function(){return f("https://storage.googleapis.com/facebook_ad_archive_screenshots/error.png")}})))},w=a(84),A=a.n(w),D=(a(158),function(e){var t=Object(g.c)("Start Date",g.b),a=Object(i.a)(t,2),n=(a[0],a[1]),r=Object(g.c)("End Date",g.b),c=Object(i.a)(r,2),s=(c[0],c[1]);return console.log(e.startDate),console.log(e.endDate),l.a.createElement("div",null,l.a.createElement("div",null,"Start Date:"," ",l.a.createElement(A.a,{selected:e.startDate,onChange:function(t){e.setStartDate(t),n(t.toString())}})),l.a.createElement("div",null,"End Date:"," ",l.a.createElement(A.a,{selected:e.endDate,onChange:function(t){e.setEndDate(t),s(t.toString())}})))}),C=a(116),x=function(e){var t=Object(g.c)(e.title,g.b),a=Object(i.a)(t,2),n=(a[0],a[1]);return console.log(e.option),l.a.createElement("div",{className:"filter-selector"},e.title,l.a.createElement(C.a,{value:e.option.selectedOption,onChange:function(t){e.setState({selectedOption:t}),n(t.value),console.log("Option selected:",t)},options:e.options,isSearchable:!0,isMulti:!1,isDisabled:e.disabled,name:e.title}))};function R(e,t){return void 0==t?e[0]:e[e.findIndex((function(e){return e.value===t}))]}var M=function(e){var t=e.showNext>0,a=t&&e.showPrevious;return t?a?l.a.createElement("div",null,l.a.createElement(d.a,{onClick:e.onClickPrevious},"Previous"),l.a.createElement(d.a,{onClick:e.onClickNext},"Next")):l.a.createElement("div",null,l.a.createElement(d.a,{onClick:e.onClickNext},"Next")):null},T=function(e){var t=e.isGetAdsRequestPending,a=e.isAdDataEmpty,n=e.ads,r=e.handleShowNeedLoginModal,c=e.resultsOffset,s=e.getPreviousPageOfAds,o=e.getNextPageOfAds;return t?l.a.createElement("div",{align:"center"},l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement(f.a,{type:"spin",color:"#000"})):a?l.a.createElement("div",null,l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement("p",null,"No results found")):l.a.createElement("div",null,l.a.createElement("div",{className:"App-ad-pane"},n.map((function(e){return l.a.createElement(k,{ad:e,key:e.ad_cluster_id,handleShowNeedLoginModal:r})}))),l.a.createElement(M,{showNext:n.length>0,showPrevious:c.current>0,onClickPrevious:s,onClickNext:o}))},P=function(e){var t=Object(g.c)("Start Date",g.b),a=Object(i.a)(t,2),r=a[0],c=(a[1],Object(g.c)("End Date",g.b)),s=Object(i.a)(c,2),o=s[0],m=(s[1],Object(g.c)("Topic",g.b)),b=Object(i.a)(m,2),f=b[0],v=(b[1],Object(g.c)("Region",g.b)),h=Object(i.a)(v,2),O=h[0],_=(h[1],Object(g.c)("Gender",g.b)),y=Object(i.a)(_,2),S=y[0],j=(y[1],Object(g.c)("Age Range",g.b)),N=Object(i.a)(j,2),k=N[0],w=(N[1],Object(g.c)("Risk Score",g.b)),A=Object(i.a)(w,2),C=A[0],M=(A[1],Object(g.c)("Sort By Field",g.b)),P=Object(i.a)(M,2),I=P[0],B=(P[1],Object(g.c)("Sort Order",g.b)),L=Object(i.a)(B,2),G=L[0],F=(L[1],Object(n.useState)(void 0===r?Object(p.default)(new Date,-7):new Date(r))),z=Object(i.a)(F,2),H=z[0],K=z[1],U=Object(n.useState)(void 0===o?new Date:new Date(o)),W=Object(i.a)(U,2),q=W[0],J=W[1],Y=Object(n.useState)({selectedOption:R(e.topics,f)}),V=Object(i.a)(Y,2),X=V[0],$=V[1],Q=Object(n.useState)({selectedOption:R(e.regions,O)}),Z=Object(i.a)(Q,2),ee=Z[0],te=Z[1],ae=Object(n.useState)({selectedOption:R(e.genders,S)}),ne=Object(i.a)(ae,2),le=ne[0],re=ne[1],ce=Object(n.useState)({selectedOption:R(e.ageRanges,k)}),se=Object(i.a)(ce,2),oe=se[0],ie=se[1],de=Object(n.useState)({selectedOption:R(e.riskScores,C)}),ue=Object(i.a)(de,2),me=ue[0],Ee=ue[1],pe=Object(n.useState)({selectedOption:R(e.orderByOptions,I)}),ge=Object(i.a)(pe,2),be=ge[0],fe=ge[1],ve=Object(n.useState)({selectedOption:R(e.orderDirections,G)}),he=Object(i.a)(ve,2),Oe=he[0],_e=he[1],ye=Object(n.useRef)(0),Se=Object(n.useState)(!1),je=Object(i.a)(Se,2),Ne=je[0],ke=je[1],we=Object(n.useState)(!1),Ae=Object(i.a)(we,2),De=Ae[0],Ce=Ae[1],xe=function(){return Ce(!0)},Re=Object(n.useState)(!1),Me=Object(i.a)(Re,2),Te=Me[0],Pe=Me[1],Ie=Object(n.useState)(!1),Be=Object(i.a)(Ie,2),Le=Be[0],Ge=Be[1],Fe=Object(n.useState)([]),ze=Object(i.a)(Fe,2),He=ze[0],Ke=ze[1],Ue=function(){Pe(!0),Ge(!0),E.a.get("/getads",{params:{startDate:H,endDate:q,topic:X.selectedOption.value,region:ee.selectedOption.label,gender:le.selectedOption.value,ageRange:oe.selectedOption.value,riskScore:me.selectedOption.value,orderBy:be.selectedOption.value,orderDirection:Oe.selectedOption.value,numResults:20,offset:ye.current}}).then((function(e){console.log(e.data),Ke(e.data),Ge(0===e.data.length),Pe(!1)})).catch((function(e){console.log(e),e.response&&401===e.response.status&&xe()})).finally((function(){}))};return l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},l.a.createElement("h1",null,"Welcome to NYU's Ad Screening System")),l.a.createElement("p",null,"Please select filters below and click 'Get Ads' to load content."," ",l.a.createElement("a",{href:"#",onClick:function(){return ke(!0)}},"Click here for more information.")),l.a.createElement("div",{className:"App-filter-selector"},l.a.createElement(x,{setState:$,option:X,title:"Topic",options:e.topics}),l.a.createElement(x,{setState:te,option:ee,title:"Region",options:e.regions,disabled:!1}),l.a.createElement(x,{setState:re,option:le,title:"Gender",options:e.genders,disabled:!1}),l.a.createElement(x,{setState:ie,option:oe,title:"Age Range",options:e.ageRanges,disabled:!1}),l.a.createElement(x,{setState:Ee,option:me,title:"Risk Score",options:e.riskScores,disabled:!1}),l.a.createElement(x,{setState:fe,option:be,title:"Sort By Field",options:e.orderByOptions,disabled:!1}),l.a.createElement(x,{setState:_e,option:Oe,title:"Sort Order",options:e.orderDirections,disabled:!1}),l.a.createElement(D,{startDate:H,setStartDate:K,endDate:q,setEndDate:J}),l.a.createElement(d.a,{variant:"primary",onClick:function(){ye.current=0,Ue()}},"Get Ads")),l.a.createElement(T,{isGetAdsRequestPending:Te,isAdDataEmpty:Le,ads:He,handleShowNeedLoginModal:xe,resultsOffset:ye,getPreviousPageOfAds:function(){var e;e=20,ye.current>=e&&(ye.current=ye.current-e),Ue()},getNextPageOfAds:function(){var e;e=20,ye.current=ye.current+e,Ue()}}),l.a.createElement(u.a,{show:Ne,onHide:function(){return ke(!1)},dialogClassName:"modal-90w",size:"lg"},l.a.createElement(u.a.Header,null,l.a.createElement(u.a.Title,null,"How To Use This Tool")),l.a.createElement(u.a.Body,null,l.a.createElement("h2",null,"Filtering Ads"),l.a.createElement("p",null,"To view ads, select a topic, and a region and/or demographic group of interest. Select a date range, and click 'Get Ads'. If you are interested in a topic that is not available, please contact us so it can be added."),l.a.createElement("h2",null,"Viewing Results"),l.a.createElement("p",null,"To see in-depth data about each ad, click 'Ad Details'."),l.a.createElement("p",null,"Results are for the entire cluster of ads; to see other ad creatives in the cluster, click on the 'Alternate Creatives' tab. Ad type classifications and entities detected are for all ads in the cluster. If you see metadata that you believe to be in error, please let us know!"),l.a.createElement("h2",null,"Limitations"),l.a.createElement("p",null,"Data is delayed approximately 48 hours. All metadata development and risk scores are EXPERIMENTAL."))),l.a.createElement(u.a,{show:De,onHide:function(){return Ce(!1)},dialogClassName:"modal-90w",size:"lg"},l.a.createElement(u.a.Header,null,l.a.createElement(u.a.Title,null,"Please Login To Use This Tool")),l.a.createElement(u.a.Body,null,l.a.createElement("h2",null,"Please login"),l.a.createElement("p",null,"Either you have not logged in yet, or your session has expired."),l.a.createElement("a",{href:"/login"},"Click here to login or register"))))},I=function(){var e=Object(n.useState)(!1),t=Object(i.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)({}),s=Object(i.a)(c,2),o=s[0],d=s[1];if(Object(n.useEffect)((function(){E.a.get("/filter-options").then((function(e){console.log(e.data),d(e.data),r(!0)})).catch((function(e){console.log(e)})).finally((function(){}))}),[]),!a)return l.a.createElement("h1",null,"Loading...");var u=o.topics,m=o.regions,p=o.genders,g=o.ageRanges,b=o.riskScores,f=o.orderByOptions,v=o.orderDirections;return l.a.createElement(P,{topics:u,regions:m,genders:p,ageRanges:g,riskScores:b,orderByOptions:f,orderDirections:v})};a(214),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(215);c.a.render(l.a.createElement(s.a,null,l.a.createElement(g.a,{ReactRouterRoute:o.a},l.a.createElement(I,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[118,1,2]]]);
//# sourceMappingURL=main.b0c95352.chunk.js.map