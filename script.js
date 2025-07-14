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
    // Scroll to teams section
    teamsContainer.scrollIntoView({ behavior: "smooth" });
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
    teams.forEach((team) => {
      const teamName = team.querySelector("h4").textContent.trim();
      const members = Array.from(team.querySelectorAll("li")).map((li) =>
        li.textContent.trim()
      );
      textToCopy += `🏆 ${teamName}\n`;
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
      const shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20team%20generator%20tool!&url=${encodeURIComponent(
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
        "Simeon",
        "Iliyana",
        "George",
        "Viki",
        "Eli",
        "Asen",
        "Lubomir",
        "Ralica",
        "Venci",
        "Slavi",
        "Djoni",
        "Apapa",
        "Mitaka G",
        "Antonio",
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
});
