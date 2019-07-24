import React from 'react';

class Trip extends React.Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-5">
                        <div className="row mt-4">
                            <div className="col-auto">
                                <h3 className="d-inline yoo-text-1">Tokyo</h3>
                                <p className="text-center">19.09.2019</p>
                            </div>
                            <div className="col text-center">
                                <svg height="50px" width="100%" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="0" y1="25" x2="100%" y2="25" stroke="#CCCCCC" strokeWidth="2" />
                                </svg>
                                <p>5 days</p>
                            </div>
                            <div className="col-auto">
                                <h3 className="d-inline yoo-text-1">Warsaw</h3>
                                <p className="text-center">24.09.2019</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <img className="trip-img" src="https://wallpapershome.com/images/pages/pic_h/666.jpg"></img>
                    </div>
                    <div className="col-3">
                        Transport: car<br />
                        Number of people: awesome<br />
                        Available slots: 2<br />
                        Accommodation: Provided<br />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        Przytulnie i funkcjonalnie wyposażone. Pokoje jednoosobowe od strony lądu (1D): ok. 20m2; klimatyzacja, balkon. Prysznic, WC, suszarka. Pokoje jednoosobowe od strony morza (1E): ok. 20m2. Pokoje dwuosobowe (1-3A): od strony morza; ok. 21m2 przyjemnie urządzone; TV sat., tel., lodówka (za opłatą ok. 5 BGN/dzień), klimatyzacja, balkon. Prysznic, WC, suszarka. Pokoje dwuosobowe (1-3B): od strony lądu, ok. 21m2. Pokoje – wariant ekonomiczny (2-3S): ok. 21m2. Pokoje rodzinne od strony morza (2-4D): dwa pokoje dwuosobowe połączone drzwiami, dwie łazienki, ok. 42m2; poza tym wyposażone jak pokoje dwuosobowe. Pokoje rodzinne od strony lądu (2-4E): wyposażone jak pokoje 2D.
                    </div>
                </div>
            </div>
        );
    }
}

export {
    Trip
}