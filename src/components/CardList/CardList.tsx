'use client';

import Card from '../Card/Card';
import styles from './CardList.module.scss';
import resultsData from '../../utils/flights.json';
import { useState, useEffect } from 'react';
import { Results, Flight } from '../../utils/types';

const results: Results = resultsData as Results;

export default function CardList() {
  const [visibleFlights, setVisibleFlights] = useState<number>(1);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [sortOption, setSortOption] = useState<string>('');
  const [stopFilters, setStopFilters] = useState<{ oneStop: boolean; noStop: boolean }>({
    oneStop: false,
    noStop: false
  });
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [selectedAirlines, setSelectedAirlines] = useState<Set<string>>(new Set());
  const [availableAirlines, setAvailableAirlines] = useState<Set<string>>(new Set());

  const flightList: Flight[] = results.result.flights;

  useEffect(() => {
    let filtered = [...flightList];

    if (stopFilters.oneStop || stopFilters.noStop) {
      filtered = filtered.filter(flight => {
        const oneStop = flight.flight.legs.some(leg => leg.segments.length === 2);
        const noStop = flight.flight.legs.every(leg => leg.segments.length === 1);
        return (stopFilters.oneStop && oneStop) || (stopFilters.noStop && noStop);
      });
    }

    if (priceRange.min !== '' || priceRange.max !== '') {
      filtered = filtered.filter(flight => {
        const price = parseFloat(flight.flight.price.total.amount);
        return (
          (priceRange.min === '' || price >= parseFloat(priceRange.min)) &&
          (priceRange.max === '' || price <= parseFloat(priceRange.max))
        );
      });
    }

    const currentAvailableAirlines = new Set(filtered.map(flight => flight.flight.carrier.caption));
    setAvailableAirlines(currentAvailableAirlines);

    if (selectedAirlines.size > 0) {
      filtered = filtered.filter(flight => selectedAirlines.has(flight.flight.carrier.caption));
    }

    if (sortOption === 'priceAsc') {
      filtered.sort(
        (a, b) => parseFloat(a.flight.price.total.amount) - parseFloat(b.flight.price.total.amount)
      );
    } else if (sortOption === 'priceDesc') {
      filtered.sort(
        (a, b) => parseFloat(b.flight.price.total.amount) - parseFloat(a.flight.price.total.amount)
      );
    } else if (sortOption === 'duration') {
      filtered.sort((a, b) => {
        const durationA = a.flight.legs.reduce((sum, leg) => sum + leg.duration, 0);
        const durationB = b.flight.legs.reduce((sum, leg) => sum + leg.duration, 0);
        return durationA - durationB;
      });
    }

    setFilteredFlights(filtered);
  }, [sortOption, stopFilters, priceRange, selectedAirlines, flightList]);

  const addFlights = () => {
    setVisibleFlights(visibleFlights + 2);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(e.target.value);
  };

  const handleStopFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStopFilters({ ...stopFilters, [e.target.name]: e.target.checked });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
  };

  const handleAirlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedAirlines = new Set(selectedAirlines);
    if (e.target.checked) {
      newSelectedAirlines.add(e.target.value);
    } else {
      newSelectedAirlines.delete(e.target.value);
    }
    setSelectedAirlines(newSelectedAirlines);
  };

  const uniqueAirlines = Array.from(
    new Set(flightList.map(flight => flight.flight.carrier.caption))
  );

  return (
    <section className={styles.cardList}>
      <div className={styles.cardList__filters}>
        <div className={styles.cardList__filterGroup}>
          <p>Сортировать:</p>
          <label>
            <input
              type="radio"
              name="sort"
              value="priceAsc"
              checked={sortOption === 'priceAsc'}
              onChange={handleSortChange}
            />
            По возрастанию цены
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="priceDesc"
              checked={sortOption === 'priceDesc'}
              onChange={handleSortChange}
            />
            По убыванию цены
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="duration"
              checked={sortOption === 'duration'}
              onChange={handleSortChange}
            />
            По времени в пути
          </label>
        </div>

        <div className={styles.cardList__filterGroup}>
          <p>Фильтровать:</p>
          <label>
            <input
              type="checkbox"
              name="oneStop"
              checked={stopFilters.oneStop}
              onChange={handleStopFilterChange}
            />
            1 пересадка
          </label>
          <label>
            <input
              type="checkbox"
              name="noStop"
              checked={stopFilters.noStop}
              onChange={handleStopFilterChange}
            />
            Без пересадок
          </label>
        </div>

        <div className={styles.cardList__filterGroup}>
          <p>Цена:</p>
          <label>
            От
            <input type="number" name="min" value={priceRange.min} onChange={handlePriceChange} />
          </label>
          <label>
            До
            <input type="number" name="max" value={priceRange.max} onChange={handlePriceChange} />
          </label>
        </div>

        <div className={styles.cardList__filterGroup}>
          <p>Авиакомпании:</p>
          {uniqueAirlines.map(airline => (
            <label key={airline}>
              <input
                type="checkbox"
                value={airline}
                checked={selectedAirlines.has(airline)}
                onChange={handleAirlineChange}
                disabled={!availableAirlines.has(airline)}
              />
              {airline}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.cardList__cards}>
        {filteredFlights.length > 0 ? (
          filteredFlights
            .slice(0, visibleFlights)
            .map(flight => <Card key={flight.flightToken} flight={flight.flight} />)
        ) : (
          <p>Ничего не найдено</p>
        )}
        {visibleFlights < filteredFlights.length && (
          <button className={styles.cardList__button} type="button" onClick={addFlights}>
            Показать ещё
          </button>
        )}
      </div>
    </section>
  );
}
