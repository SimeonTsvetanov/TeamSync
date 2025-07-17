document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const participantsTextarea = document.getElementById("participants");
  const numTeamsInput = document.getElementById("numTeams");
  const teamSizeInput = document.getElementById("teamSize");
  const generateBtn = document.getElementById("generate");
  const clearBtn = document.getElementById("clear");
  const copyTeamsBtn = document.getElementById("copy-teams");
  const teamsContainer = document.getElementById("teams-container");
  const scrollTopBtn = document.getElementById("scroll-top");
  const shareAppBtn = document.getElementById("share-app");
  
  // Function to show "Copied to clipboard" notification in center of screen
  function showCopiedNotification() {
    // Remove any existing notification
    const existingNotification = document.getElementById('center-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement("div");
    notification.id = "center-notification";
    notification.className = "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg text-sm fade-in shadow-lg";
    notification.textContent = "Copied to clipboard";
    notification.style.zIndex = "9999";
    
    // Add notification to body
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
      if (notification && notification.parentNode) {
        notification.remove();
      }
    }, 2000);
  };

  // Generate teams function
  function generateTeams(participants, numTeams) {
    // Shuffle participants array
    const shuffled = [...participants].sort(() => 0.5 - Math.random());

    // Initialize teams array
    const teams = Array.from({ length: numTeams }, () => []);

    // Distribute participants evenly
    shuffled.forEach((participant, index) => {
      teams[index % numTeams].push(participant);
    });

    return teams;
  }

  // Display teams in the UI
  function displayTeams(teams, container) {
    container.innerHTML = "";

    if (teams.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-400">
          <i class="fas fa-exclamation-circle text-4xl mb-3"></i>
          <p>No teams could be generated with the current parameters</p>
        </div>
      `;
      return;
    }

    teams.forEach((team, index) => {
      const teamElement = document.createElement("div");
      teamElement.className =
        "team-card bg-gray-50 p-4 rounded-lg border border-gray-200 fade-in";
      teamElement.innerHTML = `
        <h4 class="font-medium text-gray-700 mb-2 flex items-center">
          <span class="w-6 h-6 rounded-full flex items-center justify-center text-white mr-2 ${
            index % 2 === 0 ? "bg-primary-500" : "bg-secondary-500"
          }">${index + 1}</span>
          Team ${
            index + 1
          } <span class="ml-auto text-sm font-normal text-gray-500">${
        team.length
      } member${team.length !== 1 ? "s" : ""}</span>
        </h4>
        <ul class="space-y-1">
          ${team
            .map(
              (member) =>
                `<li class="text-gray-600 flex items-center"><i class="fas fa-user-circle mr-2 text-gray-400"></i> ${member.trim()}</li>`
            )
            .join("")}
        </ul>
      `;
      container.appendChild(teamElement);
    });
    
    // Add bottom action buttons
    const bottomActions = document.createElement("div");
    bottomActions.className = "flex justify-center mt-6 space-x-16";
    
    // Refresh button
    const refreshBtn = document.createElement("button");
    refreshBtn.className = "w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition shadow";
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshBtn.title = "Regenerate Teams";
    refreshBtn.addEventListener("click", function() {
      generateBtn.click(); // Reuse the generate button click event
    });
    
    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.className = "w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition shadow";
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = "Copy Teams";
    copyBtn.addEventListener("click", function() {
      // Call the main copy function
      copyTeamsBtn.click(); 
      
      // Show notification in center of screen
      showCopiedNotification();
    });
    
    bottomActions.appendChild(refreshBtn);
    bottomActions.appendChild(copyBtn);
    container.appendChild(bottomActions);
  }

  // Main generate button click handler
  generateBtn.addEventListener("click", function () {
    const participantsText = participantsTextarea.value.trim();

    if (!participantsText) {
      alert("Please enter at least one participant");
      return;
    }

    // Parse participants (one per line), ignore empty rows
    const participants = participantsText
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const numTeams = parseInt(numTeamsInput.value);
    if (numTeams < 2) {
      alert("Number of teams must be at least 2");
      return;
    }

    const teams = generateTeams(participants, numTeams);
    displayTeams(teams, teamsContainer);
    // Scroll to teams card section
    teamsContainer.closest(".bg-white.rounded-xl").scrollIntoView({ behavior: "smooth" });
  });

  // Clear button click handler
  clearBtn.addEventListener("click", function () {
    participantsTextarea.value = "";
    numTeamsInput.value = "2";
    teamsContainer.innerHTML = `
      <div class="text-center py-8 text-gray-400">
        <i class="fas fa-users text-4xl mb-3"></i>
        <p>Your teams will appear here</p>
      </div>
    `;
  });

  // Copy teams button click handler
  copyTeamsBtn.addEventListener("click", function () {
    const teams = teamsContainer.querySelectorAll(".team-card");
    if (teams.length === 0) {
      alert("No teams to copy");
      return;
    }

    let textToCopy = "✨ TEAMS GENERATED ✨\n\n";
    teams.forEach((team, i) => {
      const members = Array.from(team.querySelectorAll("li")).map((li) =>
        li.textContent.trim()
      );
      textToCopy += `🏆 Team ${i + 1} | Members - ${members.length}\n`;
      textToCopy += members.map((m) => `  👤 ${m}`).join("\n");
      textToCopy += "\n\n";
    });
    textToCopy += "Generated with TeamSync \n";
    textToCopy += window.location.href;

    navigator.clipboard.writeText(textToCopy.trim()).then(() => {
      // Show copied feedback
      const originalText = copyTeamsBtn.innerHTML;
      copyTeamsBtn.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
      setTimeout(() => {
        copyTeamsBtn.innerHTML = originalText;
      }, 2000);
      
      // Show copied notification
      showCopiedNotification();
    });
  });

  // Scroll to top button
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Show/hide scroll to top button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.remove("opacity-0", "invisible");
      scrollTopBtn.classList.add("opacity-100", "visible");
    } else {
      scrollTopBtn.classList.remove("opacity-100", "visible");
      scrollTopBtn.classList.add("opacity-0", "invisible");
    }
  });

  // Share app button
  shareAppBtn.addEventListener("click", function () {
    if (navigator.share) {
      navigator
        .share({
          title: "TeamSync - Random Team Generator",
          text: "Check out this awesome tool for creating random teams!",
          url: window.location.href,
        })
        .catch((err) => {
          console.log("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
        window.location.href
      )}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(
        window.location.href
      )}`;
      window.open(shareUrl, "_blank");
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Cheat code: auto-populate friends if 'the followers' is entered
  participantsTextarea.addEventListener("input", function () {
    const lines = participantsTextarea.value.split("\n");
    const cheatIndex = lines.findIndex(
      (line) => line.trim().toLowerCase() === "the followers"
    );
    if (cheatIndex !== -1) {
      const friendNames = [
        "Moni",
        "Iliyana",
        "George",
        "Viki",
        "Eli",
        "Asen",
        "Lubomir",
        "Ralica",
        "Venci",
        "Slavi",
        "Joni",
        "Apapa",
        "Mitaka G",
        "Tonkata",
        "Dinkata",
        "Raiko",
        "Tancheto",
      ];
      // Replace 'the followers' line with friendNames
      const newLines = [
        ...lines.slice(0, cheatIndex),
        ...friendNames,
        ...lines.slice(cheatIndex + 1),
      ];
      participantsTextarea.value = newLines.join("\n");
    }
  });

  // --- Hamburger Menu Logic ---
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  let menuBackdrop = null;

  function toggleMenu() {
    const isActive = hamburgerMenu.classList.contains("active");
    
    if (isActive) {
      // Close menu
      hamburgerMenu.classList.remove("active");
      mobileMenu.classList.remove("active");
      if (menuBackdrop) {
        menuBackdrop.classList.remove("active");
        setTimeout(() => {
          if (menuBackdrop && menuBackdrop.parentNode) {
            menuBackdrop.remove();
            menuBackdrop = null;
          }
        }, 300);
      }
      document.body.style.overflow = "";
    } else {
      // Open menu
      hamburgerMenu.classList.add("active");
      mobileMenu.classList.add("active");
      
      // Create backdrop
      menuBackdrop = document.createElement("div");
      menuBackdrop.className = "menu-backdrop";
      document.body.appendChild(menuBackdrop);
      
      // Activate backdrop after a small delay for smooth animation
      setTimeout(() => {
        if (menuBackdrop) {
          menuBackdrop.classList.add("active");
        }
      }, 10);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
      
      // Close menu when backdrop is clicked
      menuBackdrop.addEventListener("click", toggleMenu);
    }
  }

  hamburgerMenu.addEventListener("click", toggleMenu);

  // Close menu when navigation links are clicked
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      // Small delay to allow navigation to start before closing menu
      setTimeout(toggleMenu, 100);
    });
  });

  // --- PWA Install Button Logic ---
  const mobileNav = document.querySelector(".mobile-nav");
  const installBtn = document.createElement("a");
  installBtn.href = "#";
  installBtn.title = "Install App";
  installBtn.className = "mobile-nav-link";
  installBtn.innerHTML = '<i class="fas fa-download mr-3"></i>Install App';
  mobileNav.appendChild(installBtn);

  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  function showAppInstalledPopup() {
    let popup = document.createElement("div");
    popup.className =
      "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-primary-500 text-white px-6 py-3 rounded shadow-lg flex items-center";
    popup.innerHTML =
      '<span class="mr-4">App already installed</span><button class="ml-auto bg-white text-primary-600 px-3 py-1 rounded font-semibold">OK</button>';
    document.body.appendChild(popup);
    const okBtn = popup.querySelector("button");
    let timeout = setTimeout(() => {
      popup.remove();
    }, 4000);
    okBtn.addEventListener("click", () => {
      clearTimeout(timeout);
      popup.remove();
    });
  }

  installBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    } else {
      showAppInstalledPopup();
    }
  });
});
