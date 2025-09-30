import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import { isArray } from 'lodash';
import he from 'he'; // 👈 import decoder

const Seo = ({ seo, uri }) => {
	if (!Object.keys(seo).length) {
		return null;
	}

	const {
		title,
		description,
		og_title,
		og_description,
		og_image,
		og_site_name,
		robots,
	} = seo || {};

	// ✅ Decode potentially encoded entities
	const decodedTitle = he.decode(title || og_title || '');
	const decodedDescription = he.decode(description || og_description || '');
	const decodedOgTitle = he.decode(og_title || '');
	const decodedOgDescription = he.decode(og_description || '');

	const currentLocation = typeof window !== 'undefined' ? window.location.origin : null;
	const opengraphUrl =
		(process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : currentLocation) + uri;

	return (
		<NextSeo
			title={decodedTitle}
			description={decodedDescription}
			canonical={opengraphUrl}
			noindex={'noindex' === robots?.index}
			nofollow={'nofollow' === robots?.follow}
			robotsProps={{
				maxSnippet: parseInt(robots?.['max-snippet']?.replace('max-snippet:', '') ?? ''),
				maxImagePreview: robots?.['max-image-preview']?.replace('max-image-preview:', '') ?? '',
				maxVideoPreview: parseInt(robots?.['max-video-preview']?.replace('max-video-preview:', '') ?? ''),
			}}
			openGraph={{
				type: 'website',
				locale: 'en_US',
				url: opengraphUrl,
				title: decodedOgTitle,
				description: decodedOgDescription,
				images: [
					{
						url: isArray(og_image) ? og_image[0]?.url ?? '' : '',
						width: 1280,
						height: 720,
					},
				],
				site_name: he.decode(og_site_name || ''), // 👈 decode site name too
			}}
			twitter={{
				handle: '@Codeytek',
				site: '@Codeytek',
				cardType: 'summary_large_image',
			}}
		/>
	);
};


Seo.propTypes = {
	seo: PropTypes.object,
};

Seo.defaultProps = {
	seo: {
		title: '',
		description: '',
		og_title: '',
		og_description: '',
		og_image: [],
		og_site_name: '',
		robots: {
			follow: '',
			index: '',
		},
		article_modified_time: '',
	},
};

export default Seo;
