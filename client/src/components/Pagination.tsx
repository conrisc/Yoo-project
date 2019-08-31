import React from 'react';
import { Link } from 'react-router-dom';

class Pagination extends React.Component {

    constructor(readonly props) {
        super(props);
    }

    render() {
        const currentPage = this.props.currentPage;
        const pages = this.props.pages;
        const linkBefore = this.props.linkBefore;
        const linkAfter = this.props.linkAfter;
        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    { currentPage > 1 && 
                        <li className="page-item">
                            <Link to={`${linkBefore}/${currentPage - 1}/${linkAfter}`} className="page-link">Previous</Link>
                        </li>
                    }
                    {
                        Array(pages).map((el, index) => {
                            const page = index + 1;
                            return <li className="page-item">
                                <Link to={`${linkBefore}/${page}/${linkAfter}`} className="page-link">{page}</Link>
                            </li>
                        })
                    }
                    { currentPage < pages && 
                        <li className="page-item">
                            <Link to={`${linkBefore}/${currentPage + 1}/${linkAfter}`} className="page-link">Next</Link>
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