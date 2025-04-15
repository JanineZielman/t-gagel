import styles from "./campingBoeken.module.scss"
import { useEffect } from "react";

const Tommy = ({ product }) => {




  useEffect(() => {
    console.log("Loading Tommy widget and matrix scripts");

    // Load Tommy widget script
    const widgetScript = document.createElement("script");
    widgetScript.src = "https://api.tommybookingsupport.com/widgets/zoekenboek/js/init.js";
    widgetScript.async = true;

    // Load Tommy matrix script
    const matrixScript = document.createElement("script");
    matrixScript.src = "https://www.tommybookingsupport.com/widget/js/tommy.matrix.js";
    matrixScript.async = true;

    document.body.appendChild(widgetScript);
    // document.body.appendChild(matrixScript);

    return () => {
      if (document.body.contains(widgetScript)) {
        document.body.removeChild(widgetScript);
      }
      if (document.body.contains(matrixScript)) {
        document.body.removeChild(matrixScript);
      }
    };
  }, []);


  return (
    <div className={styles.container}>
      <tommy-widget
        data-widget="default"
        data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
        data-language="nl"
        data-period="day"
        data-booking-url="/overnachten/reserveren"
      ></tommy-widget>

      {/* <h2>Zoek en boek!</h2>
      <tommy-widget
        data-widget="mini"
        data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
        data-language="nl"
        data-base-redirect-url="/overnachten/reserveren"
      ></tommy-widget> */}
    </div>
  )
}

export default Tommy
