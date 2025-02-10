import axios from "axios";
import { BASEURL } from "../utilities_constant";
import { Sim } from "@jonz94/capacitor-sim";

export const DutyMovementGlobalApi= async(Latitude: any,Longitude: any) => {
    const formData = new FormData();
    const token = localStorage.getItem('token');
    formData.append('action', 'duty_movement');
    formData.append('token', token);
    formData.append('latitude', Latitude);
    formData.append('longitude', Longitude);
  
    const response = await axios.post(BASEURL+'dutystartmovement.php', formData);
    return response;
}

export const GetSimCards = async () => {
    const { simCards } = await Sim.getSimCards();
    if (simCards) {

      return simCards;
    }
  }


  function getSimCardsToDitail(simArr:any) {
    console.log("simArr ---", simArr);
    let tempSim = '';
    // return tempSim;

    if (simArr && simArr.length > 0) {
      simArr.map((e, key) => {
        if (key == 0) {



          tempSim = e.number;

        } else {




          tempSim = tempSim + ',' + e.number;
        }
      });
    }

    return tempSim;

  }

  export const ValidateSimcardnumber = async () => {
    let simCards=await GetSimCards();
    let regMobileno= localStorage.getItem('mobileno');
    if (simCards && simCards.length > 0) {

        const simdetail = getSimCardsToDitail(simCards);
        const simArray = simdetail.split(",");
        if (simCards.length == 1) {
          simArray[1] = '';
        }
        if (simdetail.length > 0 && simArray[0] === '' && simArray[1] === '') {
       
            alert('Not able to detect Sim card number. Connect with admin.');

        }
        else {


          if ((simArray[0] != '' && (simArray[0] === ('91' + regMobileno) || simArray[0] === (regMobileno)  || simArray[0] === ('+91' + regMobileno))) || (simArray[1] != "" && (simArray[1] === ('91' + regMobileno) || simArray[1] === (regMobileno) || simArray[1] === ('+91' + regMobileno)))) {
return true;
      
        }
        else
        {
            return false;
        }
        
      }
  }
}

export const GlobalLogout= async() => {
    try {
        // Make the API call to logout
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('action', 'logout');
        formData.append('token', token);

        await axios.post(BASEURL+'logout.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Clear local storage data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('photosData');
        localStorage.removeItem('guardalertkey');
        localStorage.removeItem('mobileno');
     
      return true;
      } catch (error) {
        return false;
      }
}


export const Checkvalidtoken= async() => {
    try {
        // Make the API call to logout
        const token = localStorage.getItem('token');
        if(token)
        {
            return false;         }
      else
      {
        return true;

      }
      } catch (error) {
        return false;
      }
}



