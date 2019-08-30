import React from 'react';
import { Link } from 'react-router-dom';

class Pagination extends React.Component {

    constructor(readonly props) {
        super(props);
    }

    render() {
        const currentPage = this.props.currentPage;
        const pages = this.props.pages;
        const link = this.props.link
        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    { currentPage > 1 && 
                        <li className="page-item">
                            <Link to={`${link}/${currentPage - 1}`} className="page-link">Previous</Link>
                        </li>
                    }
                    {
                        Array(pages).map((el, index) => {
                            const page = index + 1;
                            return <li className="page-item">
                                <Link to={`${link}/${page}`} className="page-link">{page}</Link>
                            </li>
                        })
                    }
                    { currentPage < pages && 
                        <li className="page-item">
                            <Link to={`${link}/${currentPage + 1}`} className="page-link">Next</Link>
                        </li> 
                    }
                </ul>
            </nav>
        );
    }
}

export {
    Pagination
}