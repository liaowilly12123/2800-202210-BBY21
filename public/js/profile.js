'use strict';
const params = new URLSearchParams(location.search);
const userId = params.get('id');

async function asyncMain() {
  const userInfoRes = await fetch(`/api/user/info?id=${userId}`);
  const userInfo = await userInfoRes.json();

  if (userInfo.success) {
    const payload = userInfo.payload;
    document.getElementById('firstName').value = payload.firstName;
    document.getElementById('lastName').value = payload.lastName;
    document.getElementById('email').innerText = payload.email;
    document.getElementById('type').innerText = payload.userType;
    document.getElementById('joinDate').innerText = payload.joinDate;
    
    const form = document.getElementById("profilePictureUpload");
    const inputFile = document.getElementById("uploadButton");

    const formData = new FormData();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // for(const file of inputFile.files) {
        formData.append("myImage", inputFile.files[0]);
      // }
      
      const response = await fetch("/api/user/uploadphoto", {
        method: "post", 
        body: formData,
      })
      const resJSON = await response.json();

      if (resJSON.success) {
        const response2 = await fetch("/api/user/uploadProfilePicture", {
          method: "post",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imgId: resJSON.payload.id}),
        })
        console.log(await response2.json());
      }
      document.getElementById("profileImage").src=resJSON.payload.path;
    })

    const profilepic = await fetch("/api/user/profilePicture");
    const profileJSON = await profilepic.json();
    if (profileJSON.success) {
      document.getElementById("profileImage").src=profileJSON.payload.path;
    } else {
      console.log(profileJSON)
    }

  } else {
    window.location.href = '/';
  }
}

asyncMain();
