import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <>
      {/* Logo */}
      <div className={styles.notfoundLogo}>
        <p>HaBiD</p>
      </div>

      {/* Content */}
      <div className={styles.notfoundContent}>

        {/* Oops! */}
        <p className={styles.notfoundTitle}>
          <span>Oops!</span><br/>You’ve touch a part of me no one has
        </p>
        
        <p className={styles.diagnosis}>
          Problem number: _____<br/><span>Expand diagnosis</span>
        </p>

        <div className={styles.notfoundLine}>
          <hr/>
        </div> 

        <div className={styles.notfoundLogbox}>
          <div className={styles.notfoundLogs}>
            <p>[ERROR] 2025-11-04 10:22:15 — RouteNotFoundException: GET /universe/habits/undefined</p>
            <p>[WARN] TrackerModule: Missing parameter "habitId" in request body.</p>
            <p>[INFO] Reconnecting to MongoDB... attempt #3</p>
            <p>[ERROR] MongoNetworkError: connection timed out after 5000ms</p>
            <p>[DEBUG] CacheSync — No cached data for userId: 647ab9e2f10a39fdd1e8</p>
            <p>[INFO] Retrying request with fallback route: /tracking/dashboard</p>
            <p>[WARN] UIState: component &lt;ProgressChart /&gt; failed to render — null stats received.</p>
            <p>[DEBUG] Hook useFetch() returned undefined at DashboardPage.jsx:42</p>
            <p>[ERROR] Cannot read properties of undefined (reading ‘streak’)</p>
            <p>[INFO] Redirecting user to safe zone... 🚧</p>
            <p>[404] The page you’re looking for packed up and left for a better habit.</p>
          </div>
        </div>
      </div>

    </>
  );
}