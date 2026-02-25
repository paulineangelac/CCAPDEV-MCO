/**
 * FAQsPage.js
 * -----------------------------
 * This script dynamically loads FAQ questions into the Bootstrap accordion
 * based on which category the user selects on the left sidebar.
 *
 * Features:
 * - Stores FAQ content in a structured JavaScript object (faqData)
 * - Updates the accordion content dynamically when a category is clicked
 * - Updates the section title automatically
 * - Highlights the active category in the sidebar
 * - Loads a default category on page load
 */

/**
 * FAQ DATA STORAGE
 * ----------------
 * faqData acts as a mini database for the FAQs.
 * Each key represents a category.
 * Each category contains:
 *    - title - displayed above the accordion
 *    - items - array of question/answer objects
 */
const faqData = {
  about: {
    title: "About the System",
    items: [
      {
        q: "What is the Computer Laboratory Reservation System?",
        a: "It is an online platform that allows students and faculty to reserve computer laboratories efficiently, avoiding scheduling conflicts."
      },
      {
        q: "Who can use this system?",
        a: "Authorized students, faculty members, and staff with valid institutional accounts can access the system."
      }
    ]
  },

  guidelines: {
    title: "User Guidelines",
    items: [
      {
        q: "What are the general rules when using a computer laboratory?",
        a: "Users must follow university IT policies, handle equipment responsibly, and vacate the lab on time after their reservation."
      },
      {
        q: "Can I reserve a lab for non-academic purposes?",
        a: "Laboratories are primarily intended for academic use unless prior approval is granted."
      }
    ]
  },

  account: {
    title: "Account & Access",
    items: [
      {
        q: "How do I log in to the reservation system?",
        a: "Log in using your university-issued credentials through the login page."
      },
      {
        q: "What should I do if I cannot access my account?",
        a: "Please contact the IT Services Office or use the Contact Us form for assistance."
      }
    ]
  },

  labs: {
    title: "Laboratories & Equipment",
    items: [
      {
        q: "What types of computer laboratories are available?",
        a: "Labs vary by hardware and installed software, including general-purpose and specialized laboratories."
      },
      {
        q: "Can I request specific software or equipment?",
        a: "Requests may be submitted to the IT department depending on availability and academic need."
      }
    ]
  },

  policies: {
    title: "Usage Policies & Limits",
    items: [
      {
        q: "Is there a limit to how many reservations I can make?",
        a: "Yes, limits are set to ensure fair access to laboratories for all users."
      },
      {
        q: "What happens if I miss my reservation?",
        a: "Failure to show up may result in reservation penalties or temporary restrictions."
      }
    ]
  },

  reservations: {
    title: "Reservations & Schedules",
    items: [
      {
        q: "How do I reserve a computer laboratory?",
        a: "Select an available laboratory, choose a date and time, then confirm your reservation."
      },
      {
        q: "Can I cancel or modify my reservation?",
        a: "Yes, reservations can be modified or canceled before the scheduled time through your dashboard."
      }
    ]
  }
};

/**
 * ELEMENT SELECTION
 * -----------------
 * - links - all category buttons in the sidebar
 * - accordion - container where FAQs will be inserted
 * - title - heading showing the current category name
 */
const links = document.querySelectorAll(".faq-links li");
const accordion = document.getElementById("faqAccordion");
const title = document.getElementById("faqCategoryTitle");

/**
 * FUNCTION: loadFAQs(category)
 * -----------------------------
 * Dynamically loads FAQs for the selected category.
 *
 * Steps:
 * 1. Get category data from faqData object
 * 2. Update the section title
 * 3. Clear existing accordion content
 * 4. Loop through questions and generate Bootstrap accordion items
 * 5. Insert generated HTML into the page
 */
function loadFAQs(category) {
  const data = faqData[category];
  title.textContent = data.title; // Update category title text
  accordion.innerHTML = ""; // Remove previous FAQ content

  data.items.forEach((item, index) => {
    accordion.innerHTML += `
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button ${index ? "collapsed" : ""}"
            data-bs-toggle="collapse"
            data-bs-target="#faq-${category}-${index}">
            ${item.q}
          </button>
        </h2>
        <div id="faq-${category}-${index}"
          class="accordion-collapse collapse ${index === 0 ? "show" : ""}">
          <div class="accordion-body">
            ${item.a}
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * CATEGORY CLICK HANDLER
 * ----------------------
 * When a sidebar link is clicked:
 * 1. Remove active class from all links
 * 2. Add active class to the clicked link
 * 3. Load FAQs for the clicked category
 */
links.forEach(link => {
  link.addEventListener("click", () => {
    links.forEach(l => l.classList.remove("active")); // Remove highlight from all categories
    link.classList.add("active"); // Highlight selected category
    loadFAQs(link.dataset.category); // Load FAQs
  });
});

/**
 * DEFAULT LOAD
 * ------------
 * Automatically loads the "About the System" category
 * when the page first opens.
 */
loadFAQs("about");