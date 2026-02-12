import styles from "./Facilities.module.scss"

const Facilities = ({ facilities }) => {
  // Mapping van faciliteit velden naar Material Icons en labels
  const facilityConfig = {
    wifi: {
      icon: "wifi",
      label: "wifi",
      description: facilities.beschrijving_wifi,
    },
    huisdieren_toegestaan: {
      icon: "pets",
      label: "huisdieren toegestaan",
      description: facilities.beschrijving_huisdieren_toegestaan,
    },
    trekkersplek: {
      icon: "camping",
      label: "trekkersplek",
      description: facilities.beschrijving_trekkersplek,
    },
    sanitaire_voorziening: {
      icon: "shower",
      label: "sanitaire voorziening",
      description: facilities.beschrijving_sanitaire_voorziening,
    },
  }

  // Filter alleen de faciliteiten die true zijn
  const activeFacilities = Object.entries(facilityConfig).filter(
    ([key]) => facilities[key] === true,
  )

  if (activeFacilities.length === 0) {
    return null
  }

  return (
    <div className={styles.facilities}>
      {activeFacilities.map(([key, config]) => (
        <div key={key} className={styles.facility}>
          <div className={styles.iconWrapper}>
            <span className="material-symbols-outlined">{config.icon}</span>
          </div>
          <div className={styles.label}>{config.label}</div>
          {config.description && (
            <div className={styles.description}>{config.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Facilities
