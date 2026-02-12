function editBio(){
    console.log("im accessed");
    const mainBioDiv = document.getElementById('main-bio-box');
    const currentBio = document.getElementById('profile-bio').innerText;
    const BioDiv = document.getElementById('bio-box');
    const editBtn = document.getElementById('bio-btn');

    if(BioDiv){
        const textField = document.createElement('textarea');
        const saveBtn = document.createElement('button');
        textField.value = currentBio;
        textField.id = 'bio-box';
        editBtn.innerText = 'Save';
        mainBioDiv.replaceChild(textField, BioDiv);
        editBtn.onclick = function() {
            console.log("test");
        }
        
    } 
}
        