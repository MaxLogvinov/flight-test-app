'use client';

import React from 'react';
import styles from './Card.module.scss';
import { FlightDetail } from '../../utils/types';

export default function Card({ flight }: { flight: FlightDetail }) {
  const legTo = flight.legs[0];
  const segmentsTo = legTo.segments;
  const departureSegmentTo = segmentsTo[0];
  const arrivalSegmentTo = segmentsTo[segmentsTo.length - 1];
  const hasStopoverTo = segmentsTo.length > 1;

  const legReturn = flight.legs[1];
  const segmentsReturn = legReturn.segments;
  const departureSegmentReturn = segmentsReturn[0];
  const arrivalSegmentReturn = segmentsReturn[segmentsReturn.length - 1];
  const hasStopoverReturn = segmentsReturn.length > 1;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      weekday: 'short'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <p className={styles.card__airlineName}>
          <strong className={styles.card__airlineUtd}>{flight.carrier.uid}</strong>
          {flight.carrier.caption}
        </p>
        <p className={styles.card__priceContainer}>
          <span className={styles.card__price}>
            {flight.price.total.amount}&nbsp;{flight.price.total.currency}
          </span>
          <span className={styles.card__priceText}>Стоимость для одного взрослого пассажира</span>
        </p>
      </div>

      {/* Маршрут "туда" */}
      <div className={styles.card__container}>
        <p className={styles.card__airportsNames}>
          {departureSegmentTo.departureCity.caption}, {departureSegmentTo.departureAirport.caption}{' '}
          <span className={styles.card__airportsUid}>
            ({departureSegmentTo.departureAirport.uid})
          </span>
        </p>
        &#8594;
        <p className={styles.card__airportsNames}>
          {arrivalSegmentTo.arrivalCity.caption}, {arrivalSegmentTo.arrivalAirport.caption}{' '}
          <span className={styles.card__airportsUid}>({arrivalSegmentTo.arrivalAirport.uid})</span>
        </p>
      </div>
      <div className={styles.card__container}>
        <p className={styles.card__airportsNames}>
          {formatTime(departureSegmentTo.departureDate)}{' '}
          <span className={styles.card__airportsUid}>
            {formatDate(departureSegmentTo.departureDate)}
          </span>
        </p>
        <span>
          Время в пути: {Math.floor(legTo.duration / 60)}ч {legTo.duration % 60}мин
        </span>
        <p className={styles.card__airportsNames}>
          <span className={styles.card__airportsUid}>
            {formatDate(arrivalSegmentTo.arrivalDate)}
          </span>{' '}
          {formatTime(arrivalSegmentTo.arrivalDate)}
        </p>
      </div>
      <div className={styles.card__containerLine}>
        <span className={styles.card__line}></span>
        <span className={styles.card__transfer}>
          {hasStopoverTo ? '1 пересадка' : <span className={styles.card__line_short}></span>}
        </span>
        <span className={styles.card__line}></span>
      </div>
      <div>Рейс выполняет: {departureSegmentTo.airline.caption}</div>

      {/* Маршрут "обратно" */}
      <div className={styles.card__container}>
        <p className={styles.card__airportsNames}>
          {departureSegmentReturn.departureCity.caption},{' '}
          {departureSegmentReturn.departureAirport.caption}{' '}
          <span className={styles.card__airportsUid}>
            ({departureSegmentReturn.departureAirport.uid})
          </span>
        </p>
        &#8594;
        <p className={styles.card__airportsNames}>
          {arrivalSegmentReturn.arrivalCity.caption}, {arrivalSegmentReturn.arrivalAirport.caption}{' '}
          <span className={styles.card__airportsUid}>
            ({arrivalSegmentReturn.arrivalAirport.uid})
          </span>
        </p>
      </div>
      <div className={styles.card__container}>
        <p className={styles.card__airportsNames}>
          {formatTime(departureSegmentReturn.departureDate)}{' '}
          <span className={styles.card__airportsUid}>
            {formatDate(departureSegmentReturn.departureDate)}
          </span>
        </p>
        <span>
          Время в пути: {Math.floor(legReturn.duration / 60)}ч {legReturn.duration % 60}мин
        </span>
        <p className={styles.card__airportsNames}>
          <span className={styles.card__airportsUid}>
            {formatDate(arrivalSegmentReturn.arrivalDate)}
          </span>{' '}
          {formatTime(arrivalSegmentReturn.arrivalDate)}
        </p>
      </div>
      <div className={styles.card__containerLine}>
        <span className={styles.card__line}></span>
        <span className={styles.card__transfer}>
          {hasStopoverReturn ? '1 пересадка' : <span className={styles.card__line_short}></span>}
        </span>
        <span className={styles.card__line}></span>
      </div>
      <div>Рейс выполняет: {departureSegmentReturn.airline.caption}</div>
      <button className={styles.card__chooseButton} type="button">
        Выбрать
      </button>
    </div>
  );
}
