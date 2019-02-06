import React from 'react';
import PropTypes from 'prop-types';

const SearchSysResult = ({ sendLoadSystembolagetRow, sendLoadSystembolagetImage, showImageOfWine, hideImageOfWine, isSmallScreen, systemWineData }) => {
  let tbody;
  if (isSmallScreen) {
    tbody = systemWineData.map((wine, index) =>
      <SmallScreenRow
        key={index}
        wine={wine}
        rowId={index}
        sendLoadSystembolagetRow={sendLoadSystembolagetRow}
        sendLoadSystembolagetImage={sendLoadSystembolagetImage}
        showImageOfWine={showImageOfWine}
        hideImageOfWine={hideImageOfWine}
        isSmallScreen={isSmallScreen}
      />);
  } else {
    tbody = systemWineData.map((wine, index) =>
      <Row
        key={index}
        wine={wine}
        rowId={index}
        sendLoadSystembolagetRow={sendLoadSystembolagetRow}
        sendLoadSystembolagetImage={sendLoadSystembolagetImage}
        showImageOfWine={showImageOfWine}
        hideImageOfWine={hideImageOfWine}
      />);
  }
  return (
    <div id="sysbolag-result" className="sysWineRows">
      <table className="single-systembolag-table">
        {isSmallScreen ?
          <thead />
          :
          <thead>
            <tr>
              <td>
                <div className="result-header">Namn</div>
              </td>
              <td>
                <div className="result-header">Bild</div>
              </td>
              <td>
                <div className="result-header">År</div>
              </td>
              <td>
                <div className="result-header">Land</div>
              </td>
              <td>
                <div className="result-header">Färg</div>
              </td>
              <td>
                <div className="result-header">Förpackning</div>
              </td>
              <td>
                <div className="result-header">Producent</div>
              </td>
              <td>
                <div className="result-header">Pris</div>
              </td>
              <td>
                <div className="result-header">Recensera</div>
              </td>
              <td>
                <div className="result-header">Länk</div>
              </td>
            </tr>
          </thead>
        }
        { tbody }
      </table>
    </div>
  );
};
SearchSysResult.propTypes = {
  sendLoadSystembolagetRow: PropTypes.func.isRequired,
  sendLoadSystembolagetImage: PropTypes.func.isRequired,
  showImageOfWine: PropTypes.func.isRequired,
  hideImageOfWine: PropTypes.func.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  systemWineData: PropTypes.array,
};

const Row = ({ wine, showImageOfWine, hideImageOfWine, sendLoadSystembolagetRow, rowId }) => (
  <tbody>
    <tr>
      <td>
        <div className="sys-wine-td">{wine.name}</div>
      </td>
      <td>
        <div className="sys-wine-td">
          {
            wine.image !== null ? <i
              className="fa fa-image fa-lg"
              aria-hidden="true"
              onMouseEnter={() => showImageOfWine(wine, rowId)}
              onMouseLeave={() => hideImageOfWine(rowId)}
            /> :
            <i
              className="fa fa-image fa-lg disabled"
              aria-hidden="true"
            />
          }
          {
            wine.image && wine.imageVisible &&
            <div>
              <img alt="Bild på vin" className="sysWineImage" src={wine.image} />
            </div>
          }
        </div>
      </td>
      <td>
        <div className="sys-wine-td">{wine.year}</div>
      </td>
      <td>
        <div className="sys-wine-td">{wine.country}</div>
      </td>
      <td>
        <div className="sys-wine-td">{wine.color}</div>
      </td>
      <td>
        <div className="sys-wine-td">{wine.container}</div>
      </td>
      <td>
        <div className="sys-wine-td">{wine.producer}</div>
      </td>
      <td>
        <div className="sys-wine-td">{wine.price}</div>
      </td>
      <td>
        <div className="sys-wine-td">
          <i className="fa fa-plus-square-o  fa-lg" aria-hidden="true" onClick={() => sendLoadSystembolagetRow(wine)} />
        </div>
      </td>
      <td>
        <div className="sys-wine-td">
          <i className="fa fa-link fa-lg" aria-hidden="true" onClick={() => window.open(wine.url, '_blank')} />
        </div>
      </td>
    </tr>
  </tbody>
);
Row.propTypes = {
  sendLoadSystembolagetRow: PropTypes.func.isRequired,
  showImageOfWine: PropTypes.func.isRequired,
  hideImageOfWine: PropTypes.func.isRequired,
  rowId: PropTypes.number.isRequired,
  wine: PropTypes.object.isRequired,
};

const SmallScreenRow = ({ wine, showImageOfWine, hideImageOfWine, sendLoadSystembolagetRow, rowId }) => (
  <tbody>
    <tr>
      <td rowSpan="2">
        <div className="sys-wine-td">
          {
            wine.image !== null ? <i
              className="fa fa-image fa-lg"
              aria-hidden="true"
              onMouseEnter={() => showImageOfWine(wine, rowId)}
              onMouseLeave={() => hideImageOfWine(rowId)}
            /> :
            <i
              className="fa fa-image fa-lg disabled"
              aria-hidden="true"
            />
          }
          {
            wine.image && wine.imageVisible &&
            <div>
              <img alt="Bild på vin" className="sysWineImage" src={wine.image} />
            </div>
          }
        </div>
      </td>
      <td>
        <div className="sys-wine-td title">Namn</div>
        <div className="sys-wine-td">{wine.name}</div>
      </td>
      <td>
        <div className="sys-wine-td title">År</div>
        <div className="sys-wine-td">{wine.year}</div>
      </td>
      <td>
        <div className="sys-wine-td title">Färg</div>
        <div className="sys-wine-td">{wine.color}</div>
      </td>
      <td>
        <div className="sys-wine-td title">Producent</div>
        <div className="sys-wine-td">{wine.producer}</div>
      </td>
    </tr>
    <tr>
      <td>
        <div className="sys-wine-td title">Förpackning</div>
        <div className="sys-wine-td">{wine.container}</div>
      </td>
      <td>
        <div className="sys-wine-td title">Pris</div>
        <div className="sys-wine-td">{wine.producer}</div>
      </td>
      <td>
        <div className="sys-wine-td">
          <i className="fa fa-plus-square-o  fa-lg" aria-hidden="true" onClick={() => sendLoadSystembolagetRow(wine)} />
        </div>
      </td>
      <td>
        <div className="sys-wine-td">
          <i className="fa fa-link fa-lg" aria-hidden="true" onClick={() => window.open(wine.url, '_blank')} />
        </div>
      </td>
    </tr>
  </tbody>
);
SmallScreenRow.propTypes = {
  sendLoadSystembolagetRow: PropTypes.func.isRequired,
  showImageOfWine: PropTypes.func.isRequired,
  hideImageOfWine: PropTypes.func.isRequired,
  rowId: PropTypes.number.isRequired,
  wine: PropTypes.object.isRequired,
};

export default SearchSysResult;
