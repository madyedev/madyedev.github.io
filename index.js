function loadJson(path, header, done) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
            done(JSON.parse(xhr.responseText))
    };
    xhr.open("GET", path, true);
    if (header) {
        Object.keys(header).forEach(function (key) {
            xhr.setRequestHeader(key, header[key])
        })
    }
    xhr.send()
}

function iterateElementByClassName(cls, fn) {
    var array = document.getElementsByClassName(cls)
    for (var i = 0; i < array.length; ++i)
        fn(array[i], i, array)
}

function setLatest(version, url, datetime) {
    iterateElementByClassName("latest_download_anchor", function (a) { a.setAttribute("href", url) })
    var year = datetime.getFullYear()
    var month = datetime.getMonth() + 1
    var date = datetime.getDate()
    var latest = "madye-v" + version + " (" + year + "/" + month + "/" + date + ")"
    iterateElementByClassName("latest_release_text", function (elem) {
        elem.innerHTML = latest
    })
    iterateElementByClassName("latest_visible", function (elem) { elem.style = "visibility: visible;" })
}
loadJson("https://madyedev.github.io/update.json", {}, function (json) {
    var version = json["version"]
    var url = json["all"].replace(/%VERSION%/g, version)
    loadJson("https://api.github.com/repos/madyedev/madyedev.github.io/releases/tags/v" + version,
        { accept: "application/vnd.github.v3+json" },
        function (json) { setLatest(version, url, new Date(json["published_at"])) })
})
