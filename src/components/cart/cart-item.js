import React, { useEffect, useState, useRef } from 'react';
import {isEmpty} from "lodash";
import Image from '../image';
import { deleteCartItem, updateCart } from '../../utils/cart';
import styles from './cart.module.scss'
import CustomLine from "../CustomLine/CustomLine"

const CartItem = ( {
	                   item,
	                   products,
	                   setCart
                   } ) => {
	
	const [productCount, setProductCount] = useState( item.quantity );
	const [updatingProduct, setUpdatingProduct] = useState( false );
	const [removingProduct, setRemovingProduct] = useState( false );
	const productImg = item?.data?.images?.[0] ?? '';
	
	/**
	 * Do not allow state update on an unmounted component.
	 *
	 * isMounted is used so that we can set it's value to false
	 * when the component is unmounted.
	 * This is done so that setState ( e.g setRemovingProduct ) in asynchronous calls
	 * such as axios.post, do not get executed when component leaves the DOM
	 * due to product/item deletion.
	 * If we do not do this as unsubscription, we will get
	 * "React memory leak warning- Can't perform a React state update on an unmounted component"
	 *
	 * @see https://dev.to/jexperton/how-to-fix-the-react-memory-leak-warning-d4i
	 * @type {React.MutableRefObject<boolean>}
	 */
	const isMounted = useRef( false );
	
	useEffect( () => {
		isMounted.current = true
		
		// When component is unmounted, set isMounted.current to false.
		return () => {
			isMounted.current = false
		}
	}, [] )
	
	/*
	 * Handle remove product click.
	 *
	 * @param {Object} event event
	 * @param {Integer} Product Id.
	 *
	 * @return {void}
	 */
	const handleRemoveProductClick = ( event, cartKey ) => {
		event.stopPropagation();
		
		// If the component is unmounted, or still previous item update request is in process, then return.
		if ( !isMounted || updatingProduct ) {
			return;
		}
		
		deleteCartItem( cartKey, setCart, setRemovingProduct );
	};
	
	/*
	 * When user changes the qty from product input update the cart in localStorage
	 * Also update the cart in global context
	 *
	 * @param {Object} event event
	 *
	 * @return {void}
	 */
	const handleQtyChange = ( event, cartKey, type ) => {
		
		if ( process.browser ) {
			
			event.stopPropagation();
			let newQty;
			
			// If the previous cart request is still updatingProduct or removingProduct, then return.
			if ( updatingProduct || removingProduct || ( 'decrement' === type && 1 === productCount ) ) {
				return;
			}
			
			if ( !isEmpty( type ) ) {
				newQty = 'increment' === type ? productCount + 1 : productCount - 1;
			} else {
				// If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
				newQty = ( event.target.value ) ? parseInt( event.target.value ) : 1;
			}
			
			// Set the new qty in state.
			setProductCount( newQty );
			
			if ( products.length ) {
				updateCart(item?.key, newQty, setCart, setUpdatingProduct);
			}
			
		}
	};
	
	return (
		<>
		<div className={styles.cartItem}>
			<div className={styles.cartLeft}>
				<figure >
					<Image
						width="300"
						height="300"
						altText={productImg?.alt ?? ''}
						sourceUrl={! isEmpty( productImg?.src ) ? productImg?.src : ''} // use normal <img> attributes as props
					/>
				</figure>
			</div>
			
			<div className={styles.cartRight}>
				<div className={styles.cartRightFlex}>
					<div className={styles.productTitleWrapper}>
						<div className={styles.productTitle}>
							<h3>{ item?.data?.name }</h3>
							{item?.data?.description ? <p dangerouslySetInnerHTML={{ __html: item.data.description }}/> : ''}
						</div>
						<button className={styles.clearButton} onClick={ ( event ) => handleRemoveProductClick( event, item?.key ) }>&times;</button>
					</div>
					
					<footer className={styles.cartFooter}>
						<div className="">
							<span className="cart-total-price">{item?.currency}{item?.line_subtotal}</span>
						</div>
						{/* { updatingProduct ? <img className={styles.spinner}  src="/cart-spinner.gif"  alt="spinner"/> : null } */}
						{/*Qty*/}
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<button className={styles.cartButton} onClick={( event ) => handleQtyChange( event, item?.cartKey, 'decrement' )} >-</button>
							<input
								type="number"
								min="1"
								style={{ textAlign: 'center', width: '50px', paddingRight: '0' }}
								data-cart-key={ item?.data?.cartKey }
								className={ `woo-next-cart-qty-input ml-3 ${ updatingProduct ? 'disabled' : '' } ` }
								value={ productCount }
								onChange={ ( event ) => handleQtyChange( event, item?.cartKey, '' ) }
							/>
							<button className={styles.cartButton} onClick={( event ) => handleQtyChange( event, item?.cartKey, 'increment' )}>+</button>
						</div>
					</footer>
				</div>
			</div>
		</div>
		<CustomLine height={37} strokeColor="#DCFF90" strokeWidth={3} />
		</>
	)
};

export default CartItem;
