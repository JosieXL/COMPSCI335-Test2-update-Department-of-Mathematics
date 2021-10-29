const showHome = () => {
    document.getElementById("HomeSection").style.display = "block";
    document.getElementById("StaffSection").style.display = "none";
    document.getElementById("CoursesSection").style.display = "none";
    document.getElementById("InfographicsSection").style.display = "none";

    document.getElementById("Home").style.backgroundColor = "lightGrey";
    document.getElementById("Staff").style.backgroundColor = "transparent";
    document.getElementById("Courses").style.backgroundColor = "transparent";
    document.getElementById("Infographics").style.backgroundColor = "transparent";
}

const showStaff = () => {
    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("StaffSection").style.display = "block";
    document.getElementById("CoursesSection").style.display = "none";
    document.getElementById("InfographicsSection").style.display = "none";

    document.getElementById("Home").style.backgroundColor = "transparent";
    document.getElementById("Staff").style.backgroundColor = "lightGrey";
    document.getElementById("Courses").style.backgroundColor = "transparent";
    document.getElementById("Infographics").style.backgroundColor = "transparent";
}

const showCourses = () => {
    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("StaffSection").style.display = "none";
    document.getElementById("CoursesSection").style.display = "block";
    document.getElementById("InfographicsSection").style.display = "none";

    document.getElementById("Home").style.backgroundColor = "transparent";
    document.getElementById("Staff").style.backgroundColor = "transparent";
    document.getElementById("Courses").style.backgroundColor = "lightGrey";
    document.getElementById("Infographics").style.backgroundColor = "transparent";
}

const showInfographics = () => {
    document.getElementById("HomeSection").style.display = "none";
    document.getElementById("StaffSection").style.display = "none";
    document.getElementById("CoursesSection").style.display = "none";
    document.getElementById("InfographicsSection").style.display = "block";

    document.getElementById("Home").style.backgroundColor = "transparent";
    document.getElementById("Staff").style.backgroundColor = "transparent";
    document.getElementById("Courses").style.backgroundColor = "transparent";
    document.getElementById("Infographics").style.backgroundColor = "lightGrey";
}

// Once the Web Page refreshes, it will automatically go to Home Section
window.onload = showHome;


// Staff Section information
const showStaffInfo = (data) => {
    let StaffInfo = document.getElementById("StaffInfo");
    let content = "";
    let upi = "";
    if(typeof(data) === "string"){
        data = JSON.parse(data);
    }
    
    const addRecord = (record) => {
        upi = record.profileUrl[1];
        // title + firstname + lastname
        if (record.title !== undefined) {
            content += "<div id=name>" + record.title + " " + record.firstname + " " + record.lastname + "</div><br>";
        }
        else {
            content += "<div id=name>" + record.firstname + " " + record.lastname + "</div><br>";
        }
        // profilePhoto
        if (record.imageId !== undefined) {
            content += "<img id=imageIdImg src=https://unidirectory.auckland.ac.nz/people/imageraw/"+ upi + "/" + record.imageId + "/biggest>" + "<br>";
        }
        else {
            content += "<img id=undefinedImage title='profile imageId is undefined - convert graph which found in the UOA directory' src=https://unidirectory.auckland.ac.nz/static/g5Km3OjLZuWCA8w7PdOyS4j603aTN0QC7X2gk6kRhEs.png>" + "<br>";
        }
        if (record.extn !== undefined) {
            content += "<div id=titleTowhenLastUpdated>" + "Title: " + record.jobtitles + "<br>Org Unit Name: " + record.orgunitnames + "<br>Extn: " + record.extn + "<br>WhenLastUpdated: " + record.whenLastUpdated + "<br></div>";
        }
        else {
            content += "<div id=titleTowhenLastUpdated>" + "Title: " + record.jobtitles + "<br>Org Unit Name: " + record.orgunitnames + "<br>WhenLastUpdated: " + record.whenLastUpdated + "<br></div>";
        }
        
        // vcard - tel, adr and email
        if (upi === "smau002") {
            content += "";
        }
        else if (upi !== "smau002") {
            content += "<pre id='" + upi + "'></pre>";
            getVcardInfo(upi);
        }
        // a hr at the bottom of the profile to separate
        content += "<hr class=hrline>";
    }
    data.list.forEach(addRecord);
    StaffInfo.innerHTML = content;
}

const getStaffInfo = () => {
    const url = "http://localhost:8181/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/rest/search?orgFilter=MATHS";
    const fetchPromise = fetch(encodeURI(url), {
        headers: {
            "Accept": "application/json",
        }
    });
    const streamPromise = fetchPromise.then((response) => {
        return response.text();
    });
    streamPromise.then((d) => showStaffInfo(d));
}

// Information inside Vcard - email, phone and address
const showVcardInfo = (info,upi) => {
    let arr = info.split('\n');
    let arrNew = [];
    let dic = {};
    let vcard = document.getElementById(upi);
    let VcardContent = "";
    
    const addArr = (item) => {
        if (item.includes("TEL:") || item.includes("TEL;") || item.includes("ADR:") || item.includes("ADR;") || item.includes("EMAIL:") || item.includes("EMAIL;")) {
            arrNew += [item];
            let lastIndex = item.lastIndexOf(":");
            let s1 = item.substring(0, lastIndex);
            let s2 = item.substring(lastIndex + 1);
            dic[s1] = s2;
        }
    }
    arr.forEach(addArr);
    
    let arr1 = Object.keys(dic);

    let tel = "";
    let adr = "";
    let email = "";
    
    if (arr1.length === 3) {
        if (arr1[0].includes("TEL")) {
            tel = dic[arr1[0]];
        } else if (arr1[1].includes("TEL")) {
            tel = dic[arr1[1]];
        } else if (arr1[2].includes("TEL")) {
            tel = dic[arr1[2]];
        }
        
        if (arr1[0].includes("ADR")) {
            adr = dic[arr1[0]];
        } else if (arr1[1].includes("ADR")) {
            adr = dic[arr1[1]];
        } else if (arr1[2].includes("ADR")) {
            adr = dic[arr1[2]];
        }
    
        if (arr1[0].includes("EMAIL")) {
            email = dic[arr1[0]];
        } else if (arr1[1].includes("EMAIL")) {
            email = dic[arr1[1]];
        } else if (arr1[2].includes("EMAIL")) {
            email = dic[arr1[2]];
        }

        VcardContent += "<div id=phEmAr>Phone: " + "<a href=tel:" + tel + ">" + tel + "</a><br>Email: " + "<a href=mailto:" + email + ">" + email + "</a><br>Address: " + adr.replace(/;/g, "") + "</div>";
    }
    else if (arr1.length === 2) {
        if (arr1[0].includes("TEL")) {
            tel = dic[arr1[0]];
        } else if (arr1[1].includes("TEL")) {
            tel = dic[arr1[1]];
        }
        
        if (arr1[0].includes("ADR")) {
            adr = dic[arr1[0]];
        } else if (arr1[1].includes("ADR")) {
            adr = dic[arr1[1]];
        }
    
        if (arr1[0].includes("EMAIL")) {
            email = dic[arr1[0]];
        } else if (arr1[1].includes("EMAIL")) {
            email = dic[arr1[1]];
        }
        
        VcardContent += "<div id=phEmAr>Phone: " + "<a href=tel:" + tel + ">" + tel + "</a><br>Email: " + "<a href=mailto:" + email + ">" + email + "</a><br>" + adr.replace(/;/g, "") + "</div>";
    }
    else if (arr1.length === 1) {
        if (arr1[0].includes("TEL")) {
            tel = dic[arr1[0]];
        }
        
        if (arr1[0].includes("ADR")) {
            adr = dic[arr1[0]];
        }
    
        if (arr1[0].includes("EMAIL")) {
            email = dic[arr1[0]];
        }

        VcardContent += "<div id=phEmAr>Phone: " + "<a href=tel:" + tel + ">" + tel + "</a><br>Email: " + "<a href=mailto:" + email + ">" + email + "</a><br>Address: " + adr.replace(/;/g, "") + "</div>";
    }

    vcard.innerHTML = VcardContent;
}

const getVcardInfo = (upi) => {
    const fetchPromise = fetch(encodeURI('http://localhost:8181/CorsProxyService.svc/proxy?url=https://unidirectory.auckland.ac.nz/people/vcard/' + upi + ''), {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then( (data) => showVcardInfo(data,upi) );
}

getStaffInfo();


// Courses Section information
const showCoursesInfo = (data) => {
    let CoursesInfo = document.getElementById("CoursesInfo");
    let content = "";
    if(typeof(data) === "string"){
        data = JSON.parse(data);
    }
    
    const addRecord = (record) => {
        content += "<div id=CourseTimetable title='click this box or click the X on the top right corner to close the box' onclick='hide();'><div id=close onclick='hide();'>&#10008;</div><div id=divInText></div></div>"
        // E.g. MATHS 162 and a course's title
        content += "<br><h3 id=OrgNbrTitle title='click and see the course schedule' onclick='show();ClickCourseTimetable(" + record.catalogNbr + ");'>" + record.acadOrg + " " + record.catalogNbr + "<br>" + record.titleLong + "</h3>";
        // how many points' paper and offer semester
        content += "<p id=pointAndSemester>This is a " + record.unitsAcadProg + ".0 points paper.<br>Offered in Semester " + record.crseOfferNbr + " in " + record.year + "</p>";
        // description
        if ((record.description === undefined) || (record.description === null)) {
            content += "";
        }
        else if (record.description.includes("\n")) {
            let sentence = record.description.replace(/\n/g,"<br>");
            if (sentence.includes(". Recommended preparation")) {
                let sentenceSeparate = sentence.replace(". Recommended preparation",".<br>Recommended preparation");
                content += "<p id=descr>" + sentenceSeparate + "</p>";
            }
            else {
                content += "<p id=descr>" + sentence + "</p>";
            }
        }
        else if (record.description.includes(". Recommended preparation")) {
            let sentenceSeparate1 = record.description.replace(". Recommended preparation",".<br>Recommended preparation");
            content += "<p id=descr>" + sentenceSeparate1 + "</p>";
        }
        else {
            content += "<p id=descr>" + record.description + "</p>";
        }
        // Description like preparation and restrictions
        if ((record.rqrmntDescr === undefined) || (record.rqrmntDescr === null)) {
            content += "";
        }
        else if (record.rqrmntDescr.includes("\n")) {
            let sentenceRe = record.rqrmntDescr.replace(/\n/g,"<br>");
            content += "<p id=rqrmntDescr>" + sentenceRe + "</p>";
        }
        else {
            content += "<p id=rqrmntDescr>" + record.rqrmntDescr + "</p>";
        }
    }
    data.data.forEach(addRecord);
    CoursesInfo.innerHTML = content;
}

const getCoursesInfo = () => {
    const url = "https://api.test.auckland.ac.nz/service/courses/v2/courses?subject=MATHS&year=2020&size=500";
    const fetchPromise = fetch(encodeURI(url), {
        headers: {
            "Accept": "application/json",
        }
    });
    const streamPromise = fetchPromise.then((response) => {
        return response.text();
    });
    streamPromise.then((d) => showCoursesInfo(d));
}

// function that show/hide the div
const show = () => {
    let timetableInfo = document.getElementById("CourseTimetable");
    timetableInfo.style.display = "block";
}

const hide = () => {
    let timetableInfo = document.getElementById("CourseTimetable");
    timetableInfo.style.display = "none";
}

// function ClickCourseTimetable
const ClickCourseTimetable = (catalogNbr) => {
    const url = "https://api.test.auckland.ac.nz/service/classes/v1/classes?year=2020&subject=MATHS&size=500&catalogNbr=" + catalogNbr + "";
    const fetchPromise = fetch(encodeURI(url), {
        headers: {
            "Accept": "application/json",
        }
    });
    const streamPromise = fetchPromise.then((response) => {
        return response.text();
    });
    streamPromise.then((d) => showCourseTimetableInfo(d));
}

// function showCourseTimetableInfo
const showCourseTimetableInfo = (data) => {
    let CourseTimetableInfo = document.getElementById("divInText");
    let content = "";
    if(typeof(data) === "string"){
        data = JSON.parse(data);
    }
    
    const addRecord = (timetableInfo) => {
        content += "Section: " + timetableInfo.classSection + "<br>";
        content += "Component: " + timetableInfo.component + "<br>";
        content += "EnrolCap: " + timetableInfo.enrolCap + "<br>";
        content += "EnrolTotal: " + timetableInfo.enrolTotal + "<br>";
        content += "Campus: " + timetableInfo.campus + "<br>";
        
        timetableInfo.meetingPatterns.forEach(element => {
            if ((element.startDate !== undefined) && (element.startDate !== null) && (element.endDate !== undefined) && (element.endDate !== null)) {
                content += "Date: " + element.startDate + " - " + element.endDate + "<br>";
            }
            if ((element.daysOfWeek !== undefined) && (element.daysOfWeek !== null)) {
                content += "DaysOfWeek: " + element.daysOfWeek + "<br>";
            }
            if ((element.startTime !== undefined) && (element.startTime !== null) && (element.endTime !== undefined) && (element.endTime !== null)) {
                content += "Time: " + element.startTime+ " - " + element.endTime + "<br>";
            }
            if ((element.location !== undefined) && (element.location !== null)) {
                content += "Location: " + element.location + "<br>";
            }
            content += "--------------------<br>";
        });
        content += "--------------------<br>--------------------<br>";
    }
    data.data.forEach(addRecord);
    CourseTimetableInfo.innerHTML = content;
}

getCoursesInfo();


// Infographics Section information
const getInfographicsInfo = () => {
    const fetchPromise = fetch('https://cws.auckland.ac.nz/qz20/Quiz2020ChartService.svc/g', {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then( (data) => {
        showJsonInfographicsInfo(data);
        showInfographicsGraph(data); });
}

// show TestCase part
const showJsonInfographicsInfo = (data) => {
    let ourData = document.getElementById("jsonDiv");
    let content = JSON.stringify(data,undefined, 4);
    ourData.innerHTML = content;
}

// show Graphics part
const showInfographicsGraph = (data) => {
    let ourGraph = document.getElementById("graphDiv");
    let svgContent = "";
    // Original maths logo which created in Quiz#1 
    svgContent += "<symbol id=MathsLogo preserveAspectRatio='xMidYMid meet' viewBox='0 0 500 350'>";
    svgContent += "<g transform=scale(0.1)>";
    svgContent += "" + "<line x1=58 x2=70 y1=58 y2=70 stroke-width=40 stroke=black stroke-linecap=round />";
    svgContent += "<line x1=330 x2=342 y1=70 y2=58 stroke-width=40 stroke=black stroke-linecap=round />";
    svgContent += "<line x1=195 x2=196 y1=40 y2=80 stroke-width=40 stroke=black stroke-linecap=round />";
    svgContent += "<path d='M 55 285 A 166 169 0 1 1 343 285' stroke=black stroke-width=40 stroke-linecap=round fill=none />";
    svgContent += "<circle cx=200 cy=200 r=119 fill=black stroke=black />";
    svgContent += "<circle cx=200 cy=200 r=80 fill=white stroke=white />";
    svgContent += "<circle cx=200 cy=199.7 r=19.5 fill=black stroke=black />";
    svgContent += "<circle cx=205 cy=195 r=8 fill=white stroke=white />" + "";
    svgContent += "</g></symbol>";

    let numYOrigin = 25;
    let numYAdd = 35;
    let xCoordinate = 40;
    let xOrigin = 30;
    let yOrigin = 0;
    let arr = [];
    let arr1 = [0,1,2,3,4,5,6,7,8,9,10,11];
    let num0 = 0;
    const addGraphics = (num,index) => {
        // number part which starts from 1
        svgContent += "<text id=textInSVG x=10" + " y=" + numYOrigin + " class=number>" + (index+1) + "</text>";
        // the image part - each 10 is a full image, the left is fraction
        if ((num%10) === 0) {
            let n = num/10;
            const arrN = (index) => {
                if (index < n) {
                    arr.push(num0);
                    num0++;
                }
            }
            arr1.forEach(arrN);

            const loopN = () => {
                svgContent += "<use xlink:href='#MathsLogo' x=" + xOrigin + " y=" + yOrigin + " style=opacity:1.0 />";
                xOrigin = xOrigin + xCoordinate;
            }
            arr.forEach(loopN);
        }
        else if ((num%10) !== 0) {
            let n1 = (num - num%10)/10;
            let reminder = num%10;
            const arrN1 = (index1) => {
                if (index1 < n1) {
                    arr.push(num0);
                    num0++;
                }
            }
            arr1.forEach(arrN1);

            const loopN1 = () => {
                svgContent += "<use xlink:href='#MathsLogo' x=" + xOrigin + " y=" + yOrigin + " style=opacity:1.0 />";
                xOrigin = xOrigin + xCoordinate;
            }
            arr.forEach(loopN1);
            
            // To define the clipPath
            svgContent += "<defs>";
            svgContent += "<clipPath id=clipout" + yOrigin + "1><rect x=" + xOrigin + " y=" + yOrigin + " width=4.77 height=33.2 /></clipPath>";
            svgContent += "<clipPath id=clipout" + yOrigin + "2><rect x=" + xOrigin + " y=" + yOrigin + " width=8.54 height=33.2 /></clipPath>";
            svgContent += "<clipPath id=clipout" + yOrigin + "3><rect x=" + xOrigin + " y=" + yOrigin + " width=12.31 height=33.2 /></clipPath>";
            svgContent += "<clipPath id=clipout" + yOrigin + "4><rect x=" + xOrigin + " y=" + yOrigin + " width=16.08 height=33.2 /></clipPath>";
            svgContent += "<clipPath id=clipout" + yOrigin + "5><rect x=" + xOrigin + " y=" + yOrigin + " width=19.85 height=33.2 /></clipPath>";
            svgContent += "<clipPath id=clipout" + yOrigin + "6><rect x=" + xOrigin + " y=" + yOrigin + " width=23.62 height=33.2 /></clipPath>";
            svgContent += "<clipPath id=clipout" + yOrigin + "7><rect x=" + xOrigin + " y=" + yOrigin + " width=27.39 height=33.2 /></clipPath>";
            svgContent += "<clipPath id=clipout" + yOrigin + "8><rect x=" + xOrigin + " y=" + yOrigin + " width=31.16 height=33.2 /></clipPath>";
            svgContent += "<clipPath id=clipout" + yOrigin + "9><rect x=" + xOrigin + " y=" + yOrigin + " width=34.93 height=33.2 /></clipPath>";
            svgContent += "</defs>";
            
           svgContent += "<g clip-path=url(#clipout" + yOrigin + "" + reminder + ")><use xlink:href='#MathsLogo' x=" + xOrigin + " y=" + yOrigin + " style=opacity:1.0 /></g>";
        }
        // Make sure some variables require to set back to its original, or the output would be messed up
        xOrigin = 30;
        yOrigin = yOrigin + numYAdd;
        numYOrigin = numYOrigin + numYAdd;
        arr = [];
        num0 = 0;
    }
    data.forEach(addGraphics);
    ourGraph.innerHTML = svgContent;
}

getInfographicsInfo();