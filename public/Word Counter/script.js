function updateStats() {
    const text = document.getElementById('inputText').value.trim();
    
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    const charCount = text.length;

    const sentenceCount = text.split(/[.!?]/).filter(sentence => sentence.trim().length > 0).length;

    document.getElementById('wordCount').innerText = `Word Count: ${wordCount}`;
    document.getElementById('charCount').innerText = `Character Count: ${charCount}`;
    document.getElementById('sentenceCount').innerText = `Sentence Count: ${sentenceCount}`;
}

function clearText() {
    document.getElementById('inputText').value = '';
    document.getElementById('wordCount').innerText = 'Word Count: 0';
    document.getElementById('charCount').innerText = 'Character Count: 0';
    document.getElementById('sentenceCount').innerText = 'Sentence Count: 0';
}