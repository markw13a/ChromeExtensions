const sponsorIconURL = chrome.runtime.getURL('assets/sponsor-icon.svg');
let visaSponsors = [];
const loadVisaSponsor = async () => {
    const pathToSponsorsJSON = chrome.runtime.getURL('data/visaSponsors.json');
    const res = await fetch(pathToSponsorsJSON);
    visaSponsors = await res.json();
};
loadVisaSponsor();

// For each element
// Determine if sponsor
// If sponsor, edit element

// Element structure different for different pages

const createVisaSponsorElement = () => {
    const visaSponsorContainer = document.createElement("div");
    visaSponsorContainer.style = "display: flex; flex-direction: row; align-items: center;";
    visaSponsorContainer.className = sponsorElementClassname;

    const visaSponsorIconContainer = document.createElement("div");
    visaSponsorIconContainer.style = "width: 20px; height: 20px; margin: 4px; margin-left: 0;"
    visaSponsorContainer.appendChild(visaSponsorIconContainer);

    const visaSponsorIcon = document.createElement("img");
    visaSponsorIcon.style = "color: #057642;";
    visaSponsorIcon.src = sponsorIconURL;
    visaSponsorIconContainer.appendChild(visaSponsorIcon);
    
    const visaSponsorTextContainer = document.createElement("span");
    // These classes are provided by LinkedIn's stylesheets
    visaSponsorTextContainer.className = "t-12 t-black--light";
    visaSponsorContainer.appendChild(visaSponsorTextContainer);

    const visaSponsorText = document.createTextNode("Visa sponsor");
    visaSponsorTextContainer.appendChild(visaSponsorText);

    return visaSponsorContainer;
};

// job-card-container
setInterval(() => {
    const isOnJobsPage = window.location.href.endsWith("/jobs/");
    const isOnJobSearchPage = window.location.href.includes("/jobs/search/");
    const isOnJobViewPage = window.location.href.includes("/jobs/view/");

    const sponsorElementClassname = "artdeco-entity-lockup__visa-sponsor";
    const jobContainers = Array.from(document.querySelectorAll(".jobs-search-results__list-item"));

    const sponsors = jobContainers.reduce((arr, jobContainer) => {
        const container = jobContainer.querySelector(".job-card-container__company-name");
        const companyName = container?.textContent?.trim();
        const isCompanyAVisaSponsor = !!visaSponsors.find(sponsor => sponsor.includes(companyName));

        if (isCompanyAVisaSponsor) {
            arr.push(jobContainer);
        }

        return arr;
    }, []);
    // Don't re-add the sponsor element if it's already part of the job card
    const elementsToAddSponsorContentTo = sponsors.filter(sponsor => !sponsor.querySelector(`.${sponsorElementClassname}`));

    elementsToAddSponsorContentTo.forEach((element) => {
        // "job-flavours" are supposed to present a single aspect of the job that may pique an applicant's interest
        // As there is only ever meant to be one of these shown at a time, we delete the existing job-flavors list in favour of showing the visa sponsor icon
        // https://engineering.linkedin.com/blog/2016/08/job-flavors-at-linkedin--part-i
        const jobFlavours = element.querySelector(".job-card-list__insight");
        if (jobFlavours) {
            jobFlavours.style = "display: none !important;";
        }

        // Element that contains job title, company name, etc.
        const jobContentElement = element.querySelector('.artdeco-entity-lockup__content');
        const visaSponsorElement = createVisaSponsorElement();
        jobContentElement.appendChild(visaSponsorElement);
    })
}, 500);