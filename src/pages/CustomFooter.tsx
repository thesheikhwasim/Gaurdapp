import { IonImg, IonTitle } from "@ionic/react"
import { t } from "i18next";

const CustomFooter = () => {
    return(
        <IonTitle className='footer ion-text-center'>{t('Helpline')} | +91 90999 XXXXX | Version 1.1.24</IonTitle>
    )
}

export default CustomFooter;