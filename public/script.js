
const baseURL = 'http://ergast.com/api/f1'

let currentSeason = []
let latestRaceId = 0

const attachEventHandler = () => {
    document.querySelectorAll('#list div').forEach(div => {
        div.onclick = showRace
    })
    document.getElementById('constructorsstandings').onclick = constructorsStandings;
    document.getElementById('driversstandings').onclick = driversStandings;
    document.getElementById('teaminfo').onclick = teamInfo;
    document.getElementById('driverinfo').onclick = driverInfo;
};

const display = () => {
    fetch(baseURL + '/current.json')
    .then(response => response.json())
    .then(data => {
        currentSeason = data.MRData.RaceTable.Races
        console.log(currentSeason)
        let raceList = currentSeason.map(gp => 
            `<li><a data-id="${gp.Circuit.circuitId}>${gp.raceName}</a></li>`
        );
        for (i = 0; i < raceList.length; i++){
            document.getElementById('list').insertAdjacentHTML(
                'beforeend',
                `<div data-id="${currentSeason[i].round}">
                    ${i + 1}. ${currentSeason[i].raceName}
                </div>
                `
            )
        }
    })
    .then(attachEventHandler)
    fetch(baseURL + '/current/last/results.json')
    .then(response => response.json())
    .then(data => {
        latestRace = data.MRData.RaceTable.Races[0]
        latestRaceId = latestRace.round
        document.getElementById('main').innerHTML = `
            <h2 id="raceName"> ${latestRace.raceName} </h2>
            <table id="resultsTable"> 
                <tr>
                    <th> Position </th>
                    <th> Driver </th>
                    <th> Constructor </th>
                    <th> Status </th>
                    <th> Points </th>
                </tr>
        `
        
        results = latestRace.Results
        results.forEach(driver =>
            document.getElementById('resultsTable').insertAdjacentHTML(
                `beforeend`,
                `
                <tr>
                    <td style="width:25px">${driver.position}</td>
                    <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
                    <td>${driver.Constructor.name}</td>
                    <td>${driver.status}</td>
                    <td style="width:25px">${driver.points}</td>
                </tr>
                `
            )
        )
    })
}

// display results after selecting a race. 
const showRace = ev => {
    id = ev.currentTarget.dataset.id
    let num1 = parseInt(latestRaceId)
    let num2 = parseInt(id)
    console.log(currentSeason)
    if (num2 > num1){
        document.getElementById('main').innerHTML = `
        <h2 id="raceName"> ${currentSeason[id - 1].raceName} </h2>
            <p> Circuit Information:
                <a href="${currentSeason[id-1].Circuit.url}"> ${currentSeason[id-1].Circuit.circuitName}</a>
            </p>
            <p> Race occurring on ${currentSeason[id - 1].date}</p>
            <table id="resultsTable"> 
                <tr>
                    <th> Position </th>
                    <th> Driver </th>
                    <th> Constructor </th>
                    <th> Status </th>
                    <th> Points </th>
                </tr>
        `
    }
    else {
        document.getElementById('main').innerHTML = `
        <h2 id="raceName"> ${currentSeason[id - 1].raceName} </h2>
        <p> Circuit Information:
            <a href="${currentSeason[id-1].Circuit.url}"> ${currentSeason[id-1].Circuit.circuitName}</a>
        </p>
        <p> ${currentSeason[id - 1].date}</p>
            <table id="resultsTable"> 
                <tr>
                    <th> Position </th>
                    <th> Driver </th>
                    <th> Constructor </th>
                    <th> Status </th>
                    <th> Points </th>
                </tr>
        `
        fetch(baseURL + '/current/' + id + '/results.json')
        .then(response => response.json())
        .then(data => {
            selectedRace = data.MRData.RaceTable.Races[0]
            document.getElementById('raceName').innerHTML = `
                <h2> ${selectedRace.raceName} </h2>
            `
            results = selectedRace.Results
            results.forEach(driver =>
                document.getElementById('resultsTable').insertAdjacentHTML(
                    `beforeend`,
                    `
                    <tr>
                        <td style="width:50px">${driver.position}</td>
                        <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
                        <td>${driver.Constructor.name}</td>
                        <td>${driver.status}</td>
                        <td style="width:25px">${driver.points}</td>
                    </tr>
                    `
                )
            )
        })
    }

}



const constructorsStandings = ev => {
    fetch(baseURL + '/current/constructorStandings.json')
    .then(response => response.json())
    .then(data => { 
        let cStandings = data.MRData.StandingsTable.StandingsLists[0]
        console.log(cStandings)
        document.getElementById('main').innerHTML =
        `
        <h2>Constructor Championship Standings</h2>
        <p> Standings after ${currentSeason[latestRaceId - 1].raceName}:</p>
        <table id="cStandingsTable"> 
                <tr>
                    <th style="width:125px"> Position </th>
                    <th> Constructor </th>
                    <th> Points </th>
                </tr>
        `
        cStandings.ConstructorStandings.forEach(team =>
            document.getElementById('cStandingsTable').insertAdjacentHTML(
                `beforeend`,
                `
                <tr>
                    <th style="width:125px"> ${team.position} </th>
                    <th> ${team.Constructor.name} </th>
                    <th> ${team.points} </th>
                </tr>
                `
            )
        )
    })
}

const driversStandings = ev => {
    fetch(baseURL + '/current/driverStandings.json')
    .then(response => response.json())
    .then(data => { 
        let dStandings = data.MRData.StandingsTable.StandingsLists[0]
        console.log(dStandings)
        document.getElementById('main').innerHTML =
        `
        <h2>Driver Championship Standings</h2>
        <p> Standings after ${currentSeason[latestRaceId - 1].raceName}:</p>
        <table id="dStandingsTable"> 
                <tr>
                    <th style="width:125px"> Position </th>
                    <th> Driver </th>
                    <th> Constructor </th>
                    <th> Points </th>
                </tr>
        `
        dStandings.DriverStandings.forEach(driver =>
            document.getElementById('dStandingsTable').insertAdjacentHTML(
                `beforeend`,
                `
                <tr>
                    <th style="width:125px"> ${driver.position} </th>
                    <th> ${driver.Driver.givenName} ${driver.Driver.familyName} </th>
                    <th> ${driver.Constructors[0].name} </th>
                    <th> ${driver.points} </th>
                </tr>
                `
            )
        )
    })
}

const teamInfo = ev => {
    fetch(baseURL + '/current/constructors.json')
    .then(response => response.json())
    .then(data => { 
        const info = data.MRData.ConstructorTable
        document.getElementById('main').innerHTML = ``
        info.Constructors.forEach(team =>
            document.getElementById('main').insertAdjacentHTML(
                `beforeend`,
                `
                <section id="${team.constructorId}">
                    <h1>${team.name}</h1>
                        <p>Nationality: ${team.nationality}</p>
                        <a href="${team.url}"> Team History </a>
                </section>
                `
            )        
        )
    })
}


const driverInfo = ev => {
    fetch(baseURL + '/current/drivers.json')
    .then(response => response.json())
    .then(data => { 
        const info = data.MRData.DriverTable
        console.log(info)
        document.getElementById('main').innerHTML = ``
        info.Drivers.forEach(driver => 
            document.getElementById('main').insertAdjacentHTML(
                `beforeend`,
                `
                <section id="${driver.driverId}">
                    <h1>${driver.givenName} ${driver.familyName}</h1>
                        <p>Nationality: ${driver.nationality}</p>
                        <p>Date of Birth: ${driver.dateOfBirth}</p>
                        <p>Number: ${driver.permanentNumber}</p>
                        <a href="${driver.url}"> Driver Wiki </a>
                </section>
                `
            )
        )
    })
}


display()