const baseUrl = "http://127.0.0.1:5000";
const advancedUrl = baseUrl + "/dashboard/";

const user = JSON.parse(localStorage.getItem("user"));
var selectedProject = document.getElementById("projectSelect").value;
let workedHours = JSON.parse(localStorage.getItem("overalWork")) || {};
let myDonutChart;

document.addEventListener("DOMContentLoaded", () => {
  if (!user) {
    window.location.href = baseUrl;
    return;
  }

  displayTime();

  document
    .getElementById("projectSelect")
    .addEventListener("change", function () {
      selectedProject = this.value;
      displayTime();
    });
});

function updateDonutChart() {
  const total_duration = 0.1 * 3600;
  const currentStats = workedHours[user.id][selectedProject];

  if (currentStats.clock_in && currentStats.clock_out) {
    currentStats.clock_duration = formatTime(
      currentStats.clock_in,
      currentStats.clock_out
    );
  } else if (currentStats.start_break && currentStats.stop_break) {
    currentStats.break_duration = formatTime(
      currentStats.start_break,
      currentStats.stop_break
    );
  } else if (currentStats.clock_in && currentStats.start_break) {
    currentStats.clock_duration = formatTime(
      currentStats.clock_in,
      currentStats.start_break
    );
  }

  localStorage.setItem("overalWork", JSON.stringify(workedHours));

  function timeToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  let activeTime = currentStats?.clock_duration || "00:00:00";
  let passiveTime = currentStats?.break_duration || "00:00:00";
  let workTime;
  if (timeToSeconds(activeTime) > timeToSeconds(passiveTime)) {
    workTime = secondsToTime(
      timeToSeconds(activeTime) - timeToSeconds(passiveTime)
    );
  } else {
    workTime = secondsToTime(
      timeToSeconds(passiveTime) - timeToSeconds(activeTime)
    );
  }
  let sleepTime = secondsToTime(total_duration - timeToSeconds(activeTime));

  let passivePercentage = (timeToSeconds(passiveTime) / total_duration) * 100;
  let workPercentage = (timeToSeconds(workTime) / total_duration) * 100;
  let sleepPercentage = 100 - workPercentage - passivePercentage;

  const ctx = document.getElementById("donut").getContext("2d");
  var title = selectedProject;
  if (myDonutChart) {
    myDonutChart.data.labels = [
      `Actief : ${workTime}`,
      `Actief : ${passiveTime}`,
      `Inactief : ${sleepTime}`,
    ];
    myDonutChart.data.datasets[0].data = [
      workPercentage.toFixed(2),
      passivePercentage.toFixed(2),
      sleepPercentage.toFixed(2),
    ];
    myDonutChart.options.plugins.title.text = title
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    myDonutChart.update(); // Update the chart
  } else {
    myDonutChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          `Actief : ${workTime}`,
          `Actief : ${passiveTime}`,
          `Inactief : ${sleepTime}`,
        ],
        datasets: [
          {
            label: "%",
            data: [
              workPercentage.toFixed(2),
              passivePercentage.toFixed(2),
              sleepPercentage.toFixed(2),
            ],
            backgroundColor: [
              "rgba(144, 238, 144, 0.2)", // Light Green
              "rgba(54, 162, 235, 0.2)", // Light Blue
              "rgba(255, 99, 132, 0.2)", // Light Red
            ],
            borderColor: [
              "rgba(144, 238, 144, 1)", // Pale Green
              "rgba(54, 162, 235, 1)", // Blue
              "rgba(255, 99, 132, 1)", // Red
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()),
          },
          legend: {
            display: false,
          },
        },
        responsive: true,
        animation: {
          animateScale: false,
          animateRotate: false,
        },
      },
    });
  }
}

function handleTime(self) {
  let action;
  switch (self.id) {
    case "start":
      action = "clock_in";
      break;
    case "break":
      if (!workedHours[user.id][selectedProject]["start_break"]) {
        action = "start_break";
      } else {
        action = "stop_break";
      }
      break;
    case "end":
      action = "clock_out";
      break;
  }

  if (action) {
    if (action === "clock_out") {
      document.getElementById("start").disabled = false;
      document.getElementById("break").disabled = true;
      document.getElementById("end").disabled = true;
    } else if (action === "start_break") {
      document.getElementById("start").disabled = true;
      document.getElementById("break").disabled = false;
      document.getElementById("end").disabled = true;
    } else {
      document.getElementById("start").disabled = true;
      document.getElementById("break").disabled = false;
      document.getElementById("end").disabled = false;
    }

    document.getElementById("status").className = "";
    document.getElementById("status").classList.add(action);

    var currentTime = formatTime(new Date());
    insertTime(action, currentTime);
  }
}

function insertTime(action, time) {
  if (action === "clock_in") {
    workedHours = {
      [user.id]: {
        [selectedProject]: {
          ["breaks"]: {},
        },
      },
    };
  }

  if (action === "start_break" || action === "stop_break") {
    workedHours[user.id][selectedProject]["breaks"][action] = time;
  }

  console.log(`insert ${action} with ${time}`);
  workedHours[user.id][selectedProject][action] = time;
  localStorage.setItem("overalWork", JSON.stringify(workedHours));
  updateDonutChart();

  if (action === "clock_out") {
    sendTime();
  }
}

function formatTime(clock_in, clock_out, startBreak, stopBreak) {
  if (clock_in && clock_out && startBreak && stopBreak) {
    const activeTime =
      new Date(clock_out).getTime() - new Date(clock_in).getTime();
    const passiveTime =
      startBreak && stopBreak
        ? new Date(stopBreak).getTime() - new Date(startBreak).getTime()
        : 0;
    const workedTime = activeTime - passiveTime;

    const durationInSeconds = Math.floor(workedTime / 1000);
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else if (clock_in && clock_out) {
    const In = new Date(clock_in).getTime();
    const Out = new Date(clock_out).getTime();
    const durationInMilliseconds = Out - In;

    const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else if (clock_in) {
    const date = new Date(clock_in);
    const yyyy = date.getFullYear();
    const MM = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    const ss = date.getSeconds().toString().padStart(2, "0");
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
  }
}

function sendTime() {
  Object.keys(workedHours[user.id]).forEach((project) => {
    let projectData = workedHours[user.id][project];

    if (projectData.clock_in && projectData.clock_out) {
      projectData.clock_duration = formatTime(
        projectData.clock_in,
        projectData.clock_out
      );
    }

    if (projectData.start_break && projectData.stop_break) {
      projectData.break_duration = formatTime(
        projectData.start_break,
        projectData.stop_break
      );
    }

    if (projectData.clock_in && projectData.clock_out) {
      projectData.actual_duration = formatTime(
        projectData.clock_in,
        projectData.clock_out,
        projectData.start_break,
        projectData.stop_break
      );
    }

    localStorage.setItem("overalWork", JSON.stringify(workedHours));
  });
}

function displayTime() {
  var targetArray = workedHours;

  if (!targetArray[user.id]) {
    targetArray[user.id] = {};
  }

  if (!targetArray[user.id][selectedProject]) {
    targetArray[user.id][selectedProject] = {
      breaks: {},
    };
  }

  var currentStats = targetArray[user.id][selectedProject];
  let action;
  if (currentStats.start_break && !currentStats.stop_break) {
    document.getElementById("start").disabled = true;
    document.getElementById("break").disabled = false;
    document.getElementById("end").disabled = true;
    action = "start_break";
  } else if (currentStats.clock_in && !currentStats.clock_out) {
    document.getElementById("start").disabled = true;
    document.getElementById("break").disabled = false;
    document.getElementById("end").disabled = false;
    action = "clock_in";
  } else {
    document.getElementById("start").disabled = false;
    document.getElementById("break").disabled = true;
    document.getElementById("end").disabled = true;
    action = "clock_out";
  }

  document.getElementById("status").className = "";
  document.getElementById("status").classList.add(action);
  updateDonutChart();
}
