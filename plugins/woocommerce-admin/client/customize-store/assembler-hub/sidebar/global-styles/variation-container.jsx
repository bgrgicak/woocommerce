// Reference: https://github.com/WordPress/gutenberg/blob/d5ab7238e53d0947d4bb0853464b1c58325b6130/packages/edit-site/src/components/global-styles/style-variations-container.js
/**
 * External dependencies
 */
import classnames from 'classnames';
import { useMemo, useContext } from '@wordpress/element';
import { ENTER } from '@wordpress/keycodes';
import { __, sprintf } from '@wordpress/i18n';
import { privateApis as blockEditorPrivateApis } from '@wordpress/block-editor';
import { mergeBaseAndUserConfigs } from '@wordpress/edit-site/build-module/components/global-styles/global-styles-provider';
import { unlock } from '@wordpress/edit-site/build-module/lock-unlock';
import { isEqual } from 'lodash';

const { GlobalStylesContext } = unlock( blockEditorPrivateApis );

export const VariationContainer = ( { variation, children } ) => {
	const { base, user, setUserConfig } = useContext( GlobalStylesContext );
	const context = useMemo( () => {
		return {
			user: {
				settings: variation.settings ?? {},
				styles: variation.styles ?? {},
			},
			base,
			merged: mergeBaseAndUserConfigs( base, variation ),
			setUserConfig: () => {},
		};
	}, [ variation, base ] );

	const selectVariation = () => {
		setUserConfig( () => {
			return {
				settings: mergeBaseAndUserConfigs(
					user.settings,
					variation.settings
				),
				styles: mergeBaseAndUserConfigs(
					user.styles,
					variation.styles
				),
			};
		} );
	};

	const selectOnEnter = ( event ) => {
		if ( event.keyCode === ENTER ) {
			event.preventDefault();
			selectVariation();
		}
	};

	const isActive = useMemo( () => {
		if ( variation.settings.color ) {
			return isEqual( variation.settings.color, user.settings.color );
		}
		return isEqual(
			variation.settings.typography,
			user.settings.typography
		);
	}, [ user, variation ] );

	let label = variation?.title;
	if ( variation?.description ) {
		label = sprintf(
			/* translators: %1$s: variation title. %2$s variation description. */
			__( '%1$s (%2$s)', 'woocommerce' ),
			variation?.title,
			variation?.description
		);
	}

	return (
		<GlobalStylesContext.Provider value={ context }>
			<div
				className={ classnames(
					'woocommerce-customize-store_global-styles-variations_item',
					{
						'is-active': isActive,
					}
				) }
				role="button"
				onClick={ selectVariation }
				onKeyDown={ selectOnEnter }
				tabIndex="0"
				aria-label={ label }
				aria-current={ isActive }
			>
				<div className="woocommerce-customize-store_global-styles-variations_item-preview">
					{ children }
				</div>
			</div>
		</GlobalStylesContext.Provider>
	);
};
