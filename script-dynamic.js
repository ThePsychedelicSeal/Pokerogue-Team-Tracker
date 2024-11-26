const hpBarGreen = "#39ff7b";
const hpBarYellow = "#f3b200";
const hpBarRed = "#fb3041";

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.data) {
        const party = request.data;

        const members = [];
        function createMemberObject(partyMember, index) {
          if (!partyMember) return null;

          return {
            id: `member${index + 1}`,
            originalName: partyMember.name,
            sortName: partyMember.name.replace("G-Max ", "").replace("Mega ", ""),
            form: partyMember.form,
            level: partyMember.level,
            typeOne: partyMember.types[0],
            typeTwo: partyMember.types[1],
            teraType: partyMember.teraType,
            status: partyMember.status,
            currentHp: partyMember.currentHP,
            maxHp: partyMember.maxHP
          };
        }

        for (let i = 0; i <= 5; i++) {
          const memberObject = createMemberObject(party[i], i)
          if (memberObject) {
            members.push(memberObject);
          }
        };

        function displayMembers(members) {
          const popup = document.querySelector(".popup");
          // popup.innerHTML = "";

        members.forEach(member => {
          const card = document.createElement('div');
          card.className = 'pokemon-card';
          card.id = member.id;

          card.innerHTML = `
            <div class="sprite">
                <img class="pokemon-sprite" id="${member.id}Sprite" src="./images/pokemon/${
                  member.form ? `${member.sortName}-${member.form}` : `${member.sortName}`
                }.png" alt="">
                <img id="${member.id}Form" src="" alt="">
            </div>
            <div class="stats">
                <div class="line-one">
                    <div class="name" id="${member.id}Name">${member.sortName.toUpperCase()}</div>
                    <div class="level-container">
                        <p id="${member.id}LevelText">Lv.</p>
                        <p class="level-number" id="${member.id}Level">${member.level}</p>
                    </div>
                </div>
                <div class="line-two">
                  <div class="types">
                      <img id="${member.id}TypeOne" src="${
                        member.teraType ? `./images/tera-types/${member.teraType}.png` : `./images/types/${member.typeOne}.png`
                      }" alt="">
                      <img id="${member.id}TypeTwo" src="${
                        member.teraType ? "" : `./images/types/${member.typeTwo}.png`
                      }" alt="">
                  </div>
                </div>
                <div class="line-three">
                    <img id="${member.id}Status" class="status" src="./images/status/${member.status}.png" alt="">
                </div>
                <div class="line-four">
                    <div id="${member.id}HpBar" class="hp-container">
                        <div id="${member.id}ActiveHp" class="hp-bar"></div>
                    </div>
                </div>
            </div>
          `;

          popup.appendChild(card);

          const hpPercentage = (member.currentHp / member.maxHp) * 100;
          const hpBar = card.querySelector(`#${member.id}HpBar`);
          
          console.log(hpPercentage)
          console.log(hpBar)

          function setHp(percentage, hp) {
            hp.style.transition = "width 0.2s linear, background-color 0.2s ease";
            hp.style.width = `${percentage}%`;
            if (percentage <= 25) {
              hp.style.backgroundColor = hpBarRed;
            } else if (percentage <= 50) {
              hp.style.backgroundColor = hpBarYellow;
            } else {
              hp.style.backgroundColor = hpBarGreen;
            }
          };
          
          setHp(hpPercentage, hpBar);
      });
    }
      members.sort((a, b) => a.sortName.localeCompare(b.sortName));
      displayMembers(members);
    }
  }
);