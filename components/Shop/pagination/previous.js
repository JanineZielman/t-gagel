import { isEmpty } from 'lodash';
import Link from 'next/link';

const Previous = ( { currentPageNo, postName } ) => {
	
	if ( ! currentPageNo || isEmpty( postName ) ) {
		return null;
	}
	
	// If you are on the first page, don't show previous link.
	if ( 0 === currentPageNo - 1 ) {
		return null;
	}
	
	const paginationLink = `/${ postName }/page/${ currentPageNo - 1 }/`;
	
	return (
		<Link href={ paginationLink }>
			Previous
		</Link>
	);
};

export default Previous;
