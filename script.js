const hpBarGreen = "#39ff7b";
const hpBarYellow = "#f3b200";
const hpBarRed = "#fb3041";
const cardColor = "#ffffcc";
const pokemonCards = Array.from(document.querySelectorAll(".pokemon-card"));
const indexToText = ["One", "Two", "Three", "Four", "Five", "Six"];


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.data) {
      party = request.data;

      function setHp(percentage, hp) {
        hp.style.width = percentage + "%";
        if (percentage <= 25) {
          hp.style.backgroundColor = hpBarRed;
        } else if (percentage <= 50) {
          hp.style.backgroundColor = hpBarYellow;
        } else {
          hp.style.backgroundColor = hpBarGreen;
        }
      };

      function sortCards() {
        pokemonCards.sort((a, b) => {
          const hasInfoA = a.querySelector('.name').textContent !== "";
          const hasInfoB = b.querySelector('.name').textContent !== "";
      
          // If card A has info and card B doesn't, put A first
          if (hasInfoA && !hasInfoB) {
            return -1; // A comes before B
          } else if (!hasInfoA && hasInfoB) {
            return 1;  // B comes before A
          } else {
            // If both or neither have information, sort alphabetically by name
            let nameA = a.querySelector('.name').textContent;
            let nameB = b.querySelector('.name').textContent;
            return nameA.localeCompare(nameB); // Alphabetical order
          }
        });

        pokemonCards.forEach((card, index) => {
          card.style.order = index;
        });
      };

      // Function to update a single member's card
      function updateMember(memberIndex, memberData) {
        const cardId = `card${indexToText[memberIndex]}`;
        const nameElement = document.getElementById(`member${indexToText[memberIndex]}Name`);
        const spriteElement = document.getElementById(`member${indexToText[memberIndex]}Sprite`);
        const formElement = document.getElementById(`member${indexToText[memberIndex]}Form`);
        const levelTextElement = document.getElementById(`member${indexToText[memberIndex]}LevelText`);
        const levelElement = document.getElementById(`member${indexToText[memberIndex]}Level`);
        const typeOneElement = document.getElementById(`member${indexToText[memberIndex]}TypeOne`);
        const typeTwoElement = document.getElementById(`member${indexToText[memberIndex]}TypeTwo`);
        const statusElement = document.getElementById(`member${indexToText[memberIndex]}Status`);
        const hpBarElement = document.getElementById(`member${indexToText[memberIndex]}HpBar`);
        const activeHpElement = document.getElementById(`member${indexToText[memberIndex]}ActiveHp`);

        // Show/hide elements based on level and HP
        if (memberData.level > 0) {
          if (levelTextElement) levelTextElement.style.display = "block";
          if (hpBarElement) hpBarElement.style.display = "block";
          const cardElement = document.getElementById(cardId);
          if (cardElement) cardElement.style.backgroundColor = cardColor;
        }

        // Handle form and name
        const formName = memberData.form ? memberData.name.replace("G-Max ", "").replace("Mega ", "") : memberData.name;
        if (nameElement) nameElement.textContent = formName.toUpperCase();

        if (spriteElement) {
          if (memberData.form) {
            spriteElement.src = `./images/pokemon/${formName}-${memberData.form}.png`;
          } else {
            spriteElement.src = `./images/pokemon/${memberData.name}.png`;
          }
        }

        // Handle formElement (show blank if form is empty)
        if (formElement) {
          formElement.src = memberData.form ? `./images/forms/${memberData.form}.png` : "";
        }

        // Set level (only if available)
        if (levelElement && memberData.level != null) {
          levelElement.textContent = memberData.level;
        }

        // Set types (only if available)
        if (typeOneElement && memberData.types && memberData.types[0]) {
          typeOneElement.src = `./images/types/${memberData.types[0]}.png`;
        } else if (typeOneElement) {
          typeOneElement.src = "";  // Set to blank if no type
        }

        if (typeTwoElement && memberData.types && memberData.types[1]) {
          typeTwoElement.src = `./images/types/${memberData.types[1]}.png`;
        } else if (typeTwoElement) {
          typeTwoElement.src = "";  // Set to blank if no second type
        }

        // Set status (only if available)
        if (statusElement) {
          statusElement.src = memberData.status ? `./images/status/${memberData.status}.png` : "";  // Blank if empty
        }

        // Set HP (only if available)
        if (activeHpElement && memberData.currentHP != null && memberData.maxHP != null) {
          const hpPercentage = (memberData.currentHP / memberData.maxHP) * 100;
          setHp(hpPercentage, activeHpElement);
        }

        console.log(memberIndex)
      }

      // Loop through all members and update their data
      party.forEach((member, index) => {
        updateMember(index, member);
      });

      sortCards();
    }
  });