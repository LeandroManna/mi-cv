function translateCV(lang) {
    const cvContent = document.getElementById("cv-content").innerText;
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(cvContent)}`)
        .then(response => response.json())
        .then(data => {
            const translatedText = data[0].map(item => item[0]).join(" ");
            document.getElementById("cv-content").innerText = translatedText;
        })
        .catch(error => console.error("Error en la traducción:", error));
}