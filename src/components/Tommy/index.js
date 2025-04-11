import styles from "./campingBoeken.module.scss"

const Tommy = ({ product }) => {
  return (
    <div className={styles.container}>
      {/* <tommy-widget
      data-widget="default"
      data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
      data-language="nl"
      data-period="day"
      data-booking-url="/overnachten/reserveren"
      ></tommy-widget> */}


<h2>Zoek en boek!</h2>
      <tommy-widget
        data-widget="mini"
        data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
        data-language="nl"
        data-base-redirect-url="/overnachten/reserveren"
      ></tommy-widget>
    </div>
  )
}

export default Tommy
