import Image from "../image"
import CallToActionButton from "../Bits/CallToActionButton"
import CustomLine from "../CustomLine/CustomLine"
import Facilities from "../Facilities"
import { fixImageSizes } from "../../utils/fixImageSizes"

const Sections = ({ sections, facilities }) => {
  return (
    <div className="sections">
      {sections.map((item, i) => {
        return (
          <div key={i} className={"textSection"}>
            <div
              className="text-wrapper"
              dangerouslySetInnerHTML={{
                __html: fixImageSizes(item.text_section),
              }}
            />
            {item.card && (
              <div className="cards">
                {item.card.map((cardItem, j) => {
                  return (
                    <div key={j} className="card">
                      <h3>
                        {cardItem.firstname} <br />
                        {cardItem.lastname}
                      </h3>
                      <Image
                        width={800}
                        height={800}
                        sourceUrl={cardItem.image.url}
                      />
                      <div className="text">{cardItem.text}</div>
                    </div>
                  )
                })}
              </div>
            )}
            {item.linkPage && (
              <div className="center">
                <CallToActionButton
                  link={item.linkPage.url.replace("https://cms.gagel.nl", "")}
                >
                  Lees meer ...
                </CallToActionButton>
              </div>
            )}
            <CustomLine height={37} strokeColor="#DCFF90" strokeWidth={3} />
          </div>
        )
      })}
      {facilities && <Facilities facilities={facilities} />}
    </div>
  )
}

export default Sections
