import styles from "./campingBoeken.module.scss"
import { useEffect } from "react"

const Tommy = ({ product }) => {
  useEffect(() => {
    console.log("Loading Tommy widget script")
    // Load Tommy widget script before the component renders
    const widgetScript = document.createElement("script")
    widgetScript.src =
      "https://api.tommybookingsupport.com/widgets/zoekenboek/js/init.js"
    widgetScript.async = true

    document.body.appendChild(widgetScript)

    return () => {
      if (document.body.contains(widgetScript)) {
        document.body.removeChild(widgetScript)
      }
    }
  }, [])

  return (
    <div className={styles.container} suppressHydrationWarning>
      <tommy-widget
        data-widget="mini"
        data-api-token="GagelLochem:6501dc199c514235a989b6e8c637137cc3a99211b139a3ce8c2d6229863507b7"
        data-language="nl"
        data-base-redirect-url="/overnachten/zoekenboek"
        data-groepen="true"
      ></tommy-widget>

      <script src="https://api.tommybookingsupport.com/widgets/zoekenboek/js/init.js"></script>
      {/* <script src="https://www.tommybookingsupport.com/widget/js/tommy.matrix.js"
        type="application/javascript" language="javascript"></script> */}
    </div>
  )
}

export default Tommy
