import { IonImg } from "@ionic/react"

const CustomHeader = () => {
    return(
        <div className='customHeaderParent'>
            <IonImg
            className="header-image customHeaderClass"
            src="./assets/imgs/logo.jpg"
            alt="header"
            style={{  height: '60px' }}
            />
        </div>
    )
}

export default CustomHeader;