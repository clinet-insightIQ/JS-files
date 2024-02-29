console.log("Working!!");

const analyze = (e) => {
  e.preventDefault();
  console.log("Analyzing...");
  //hide error
  selectors.usernameErrorLabel.style.display = "none";
  selectors.brandnameErrorLabel.style.display = "none";
  //  console.log("Selectors", selectors);
  //validation form input
  const brandname = getValue(`[${prefix[0]}=brandname]`);
  const username = getValue(`[${prefix[0]}=username]`);
  if (!brandname.length) {
    selectors.brandnameErrorLabel.style.display = "block";
    return;
  }

  if (!username.length) {
    selectors.usernameErrorLabel.style.display = "block";
    return;
  }

  // reset popup form
  const emailEle = getElement(`[${prefix[0]}=email]`);
  const nameEle = getElement(`[${prefix[0]}=name]`);

  emailEle.value = "";
  nameEle.value = "";
  selectors.popupForm.style.display = "flex";
  selectors.brandPopup.style.display = "block";
  selectors.brandPopupError.style.display = "none";
  selectors.brandPopupSuccess.style.display = "none";
};
const invalidEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "competitor.com",
];
const validEmail = (email) => {
  console.log("Validating...");
  const domain = email.split("@")[1];
  if (!email?.length) return false;
  if (invalidEmailDomains.includes(domain)) return false;
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmail = emailPattern.test(email);

  /*  if (validEmail) {
    const isDisposable = await isDisposableEmail(email);
    console.log(">>>DDD", isDisposable);
    return !isDisposable;
  } */
  return validEmail;
};

const formSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting...");
  selectors.emailErrorLabel.style.display = "none";
  selectors.nameErrorLabel.style.display = "none";
  //incase submit again
  selectors.brandPopupError.style.display = "none";
  selectors.brandPopupSuccess.style.display = "none";

  if (!validEmail(getValue(`[${prefix[0]}=email]`))) {
    selectors.emailErrorLabel.style.display = "block";
    return;
  }

  if (!getValue(`[${prefix[0]}=name]`).length) {
    selectors.nameErrorLabel.style.display = "block";
    return;
  }

  selectors.submitBtnLoader.style.display = "block";
  selectors.submitBtn.value = "";
  selectors.username = getValue(`[${prefix[0]}=username]`);
  selectors.brandname = getValue(`[${prefix[0]}=brandname]`);
  selectors.email = getValue(`[${prefix[0]}=email]`);
  selectors.requestorname = getValue(`[${prefix[0]}=name]`);

  //update hubspot form values
  const hubspotBrandname = getElement(`[${prefix[0]}=hubspot-brandname]`);
  const hubspotEmail = getElement(`[${prefix[0]}=hubspot-email]`);
  const hubspotUsername = getElement(`[${prefix[0]}=hubspot-username]`);
  const hubspotName = getElement(`[${prefix[0]}=hubspot-name]`);
  const hubspotFormSubmitBtn = getElement(`[${prefix[0]}=hidden-form-submit]`);
  hubspotBrandname.value = selectors.brandname;
  hubspotEmail.value = selectors.email;
  hubspotUsername.value = selectors.username;
  hubspotName.value = selectors.requestorname;
  //submit the form
  hubspotFormSubmitBtn?.click();

  //fetch data
  const data = await requestForReport();
  selectors.submitBtnLoader.style.display = "none";
  selectors.submitBtn.value = "Submit";
  //invalid business email show error label
  if (
    data?.status === 400 &&
    data?.statusText.includes("Invalid buisness email")
  ) {
    //show error
    console.log("email error label");
    selectors.emailErrorLabel.style.display = "block";

    return;
  }

  //maximum request reached show error popup
  selectors.popupForm.style.display = "none";
  if (data?.status === 400 && data?.statusText.includes("Max Limit")) {
    //show error
    console.log("error popup");
    selectors.brandPopupError.style.display = "block";
    selectors.brandPopupSuccess.style.display = "none";
    return;
  }
  selectors.brandPopupSuccess.style.display = "block";
  // console.log("Request response", data);

  //update UI
  // updateUI(data);

  //reset form
  // selectors.brandPopup.style.display = "none";
  selectors.username.value = "";
  selectors.brandname.value = "";
  selectors.email.value = "";
};

const appendInstaUrl = (instahandle) => {
  return `https://instagram.com/${instahandle}`;
};

const requestForReport = async () => {
  const url = new URL(
    "https://brand-report-apis.react-webflow-rp.workers.dev/request-report"
  );
  url.searchParams.append("u", appendInstaUrl(selectors.username));
  url.searchParams.append("b", appendInstaUrl(selectors.brandname));
  url.searchParams.append("e", selectors.email);
  url.searchParams.append("n", selectors.requestorname);

  try {
    const response = await (await fetch(url)).json();
    return response;
  } catch (err) {
    console.log("Error in requesting for report", err);
  }
  return;
};

const updateUI = (data) => {
  //user
  selectors.userName.innerText = data?.userProfileData?.username;
  selectors.userhandle.innerText = data?.userProfileData?.userhandle;
  selectors.userFollowersCount.innerText = data?.userProfileData?.followers;
  selectors.userPicture.src = data?.userProfileData?.profilePicture;
  //brand
  setInnerText(selectors.brandName, data?.brandProfileData?.username);
  setInnerText(selectors.brandhandle, data?.brandProfileData?.userhandle);
  setInnerText(
    selectors.brandFollowersCount,
    data?.brandProfileData?.followers
  );
  selectors.brandPicture.src = data?.brandProfileData?.profilePicture;
};

function debounce(cb, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      return cb(...args);
    }, delay);
  };
}

const Search_URL = "https://insightiq-api.nrj.life/search?";

const fetchAutocompleteResults = debounce(async (req) => {
  const FinalUrl = new URL(Search_URL);
  FinalUrl.searchParams.set("q", req.query);
  FinalUrl.searchParams.set("p", req.platform || "it");
  FinalUrl.searchParams.set("sf", "ff");

  /*  TrackEvent(EventNames.ffUserNameEntered, {
    username: req.query,
    platform_name: "instagram",
  }); */

  try {
    const response = await (
      await fetch(FinalUrl, {
        method: "GET",
      })
    ).json();
    req.onSuccess(response);
    return response;
  } catch (err) {
    console.log("<< Error in fethcing >>", err);
  }
}, 500);

const handleTextChange = async (e, autocompleteLoaderEle) => {
  autocompleteLoaderEle.style.display = "block";
  //if (timeId) clearTimeout(timeId);
  const query = e.target.value;
  // const query_input_value = searchInput.value;
  currentHandle = query;
  // console.log("Testing values::", { query, query_input_value });
  if (!query || !query.length) {
    autocompleteLoaderEle.style.display = "none";
    resultList.innerHTML = "";
    return;
  }
  //let results;
  fetchAutocompleteResults({
    query,
    onSuccess: (results) => {
      // console.log("Autocomplte values", results);

      autocompleteLoaderEle.style.display = "none";
      if (query.length && results && results?.data?.length) {
        resultList.innerHTML = "";
        results.data.forEach((profile) => {
          const cloneListItem = listItem.cloneNode(true);
          const itemImg = cloneListItem.querySelector(listItemImgAttr);
          const itemFullName = cloneListItem.querySelector(listItemNameAttr);
          const itemUsername =
            cloneListItem.querySelector(listItemUsernameAttr);
          const itemVerified = cloneListItem.querySelector(
            listItemIsVerifiedAttr
          );

          itemImg.src = profile.picture;
          itemImg.alt = `${profile.fullname}'s image`;
          itemFullName.innerText = profile.fullname;
          itemUsername.innerText = `@${profile.username}`;
          if (!profile.is_verified) {
            itemVerified.style.display = "none";
          }
          cloneListItem.addEventListener("click", () => {
            //searchInput.value = "";
            e.target.value = profile.username;
            currentHandle = profile.username;
            resultList.style.display = "none";

            /* TrackEvent(EventNames.ffProfileSelected, {
              username: profile.username,
              platform_name: "instagram",
            }); */
          });

          resultList.appendChild(cloneListItem);
        });
        resultList.style.zIndex = 10;
        resultList.style.display = "flex";
      } else {
        //resultList.style.display = "none";
        resultList.innerHTML = `<div> No results found </div>`;
      }
    },
  });
};

const selectors = {};
let currentHandle = null;
const prefix = ["form-input", "page-item", "data", "popup-item"];
const getElement = (selector) => document.querySelector(selector);
const getValue = (selector) => {
  return getElement(selector)?.value;
};
const setInnerText = (ref, text) => {
  ref.innerText = text;
};

selectors.brandPopup = getElement(`[${prefix[1]}=brandPopup]`);
selectors.brandPopupSuccess = getElement(`[${prefix[1]}=brand-popup-success]`);
selectors.brandPopupError = getElement(`[${prefix[1]}=brand-popup-limit]`);
//profile elements
selectors.userName = getElement(`[${prefix[1]}=username]`);
selectors.brandName = getElement(`[${prefix[1]}=brandname]`);
selectors.userhandle = getElement(`[${prefix[1]}=userhandle]`);
selectors.brandhandle = getElement(`[${prefix[1]}=brandhandle]`);
selectors.userFollowersCount = getElement(`[${prefix[1]}=userFollowersCount]`);
selectors.brandFollowersCount = getElement(
  `[${prefix[1]}=brandFollowersCount]`
);
selectors.userPicture = getElement(`[${prefix[1]}=userPicture]`);
selectors.brandPicture = getElement(`[${prefix[1]}=brandPicture]`);

//error labels
selectors.brandnameErrorLabel = getElement(
  `[${prefix[1]}=brandname-error-label]`
);
selectors.usernameErrorLabel = getElement(
  `[${prefix[1]}=username-error-label]`
);
selectors.nameErrorLabel = getElement(`[${prefix[1]}=name-error-label]`);
selectors.emailErrorLabel = getElement(`[${prefix[1]}=email-error-label]`);
selectors.checkAllEmotions = getElement(`[${prefix[1]}=emotions-checkAll]`);
selectors.checkAllInterests = getElement(`[${prefix[1]}=interest-checkAll]`);
selectors.popupTitleEle = getElement(`[${prefix[3]}="main-title"]`);
selectors.popupTileOneEle = getElement(`[${prefix[3]}=title-2]`);
selectors.popupTileTwoEle = getElement(`[${prefix[3]}=title-3]`);

//TODO: add loader
//const autocompleteLoaderEle = getElement() || {};

const resultList = document.querySelector("[data=result-list]");
const listItem = document.querySelector("[data=list-item]");
const listItemImgAttr = "[data=item-image]";
const listItemNameAttr = "[data=list-item-name]";
const listItemUsernameAttr = "[data=list-item-username]";
const listItemIsVerifiedAttr = "[data=item-is-verified]";

selectors.brandnameLoader = getElement(`[${prefix[0]}=loader-dots-brandname]`);
selectors.usernameLoader = getElement(`[${prefix[0]}=loader-dots-username]`);
selectors.submitBtnLoader = getElement(`[${prefix[0]}=loader-submit]`);
selectors.submitBtn = getElement(`[${prefix[0]}=submitBtn]`);
selectors.popupForm = getElement(`[${prefix[1]}=second-form]`);

selectors.checkAllEmotions.addEventListener("click", () => {
  setInnerText(selectors.popupTitleEle, "All emotions");
  setInnerText(selectors.popupTileOneEle, "Shared emotions");
  setInnerText(selectors.popupTileTwoEle, "All other emotions");
});

selectors.checkAllInterests.addEventListener("click", () => {
  setInnerText(selectors.popupTitleEle, "All interests");
  setInnerText(selectors.popupTileOneEle, "Shared interests");
  setInnerText(selectors.popupTileTwoEle, "All other interests");
});

//input change
selectors.userNameInput = getElement(
  `[${prefix[0]}=username]`
).addEventListener("input", (e) =>
  handleTextChange(e, selectors.usernameLoader)
);
selectors.brandNameInput = getElement(
  `[${prefix[0]}=brandname]`
).addEventListener("input", (e) =>
  handleTextChange(e, selectors.brandnameLoader)
);

//action buttons
selectors.analyzeBtnClick = getElement(
  `[${prefix[0]}=analyzeBtn]`
)?.addEventListener("click", analyze);
selectors.submitBtnClick = getElement(
  `[${prefix[0]}=submitBtn]`
)?.addEventListener("click", formSubmit);

const emotions = [
  "Admiration",
  "Excitement",
  "Disapproval",
  "Caring",
  "Confusion",
  "Optimism",
  "Disappointment",
  "Fear",
  "Surprise",
  "Neutral",
];

const interests = [
  { name: "Television & Film" },
  { name: "Music" },
  { name: "Shopping & Retail" },
  { name: "Coffee, Tea & Beverages" },
  { name: "Camera & Photography" },
  { name: "Clothes, Shoes, Handbags & Accessories" },
  { name: "Beer, Wine & Spirits" },
  { name: "Sports" },
  { name: "Electronics & Computers" },
  { name: "Gaming" },
  { name: "Activewear" },
  { name: "Art & Design" },
  { name: "Travel, Tourism & Aviation" },
  { name: "Business & Careers" },
  { name: "Beauty & Cosmetics" },
  { name: "Healthcare & Medicine" },
  { name: "Jewellery & Watches" },
  { name: "Restaurants, Food & Grocery" },
  { name: "Toys, Children & Baby" },
  { name: "Fitness & Yoga" },
  { name: "Wedding" },
  { name: "Tobacco & Smoking" },
  { name: "Pets" },
  { name: "Healthy Lifestyle" },
  { name: "Luxury Goods" },
  { name: "Home Decor, Furniture & Garden" },
  { name: "Friends, Family & Relationships" },
  { name: "Cars & Motorbikes" },
];
