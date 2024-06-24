'use client';

import CardList from '@/components/CardList/CardList';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <CardList />
    </main>
  );
}
