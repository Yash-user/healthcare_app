// app/progress.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

// Try to load charts. If not installed yet, we render fallbacks.
let V = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  V = require('victory-native');
} catch (e) {
  V = null;
}

const { width } = Dimensions.get('window');
const CHART_W = Math.min(width - 32, 560);
const CARD_PAD = 14;

const COLORS = {
  bg: '#F8FAFC',        // page background
  card: '#FFFFFF',      // card background
  border: '#E5E7EB',    // soft gray
  text: '#0B0F1A',      // near-black
  subtext: '#4B5563',   // muted
  blue: '#2563EB',      // primary blue
  red: '#DC2626',       // accent red
  black: '#0B0F1A',     // black accents
  grayTrack: '#EEF2F7', // neutral track
  green: '#10B981',     // success green
  level1: '#EF4444',    // red for level 1
  level2: '#F59E0B',    // amber for level 2
  level3: '#10B981',    // green for level 3
};

// ========= Sample data (replace with API/store values) =========
const totalSessions = 24;
const completedSessions = 15;
const completionPct = Math.round((completedSessions / totalSessions) * 100);

// Per-therapy session completion (done vs total)
const therapyFields = [
  { key: 'Detox', done: 13, total: 18, color: COLORS.level1 },
  { key: 'Rejuvenation', done: 8, total: 12, color: COLORS.level2 },
  { key: 'Mobility', done: 6, total: 10, color: COLORS.level1 },
  { key: 'Sleep', done: 9, total: 11, color: COLORS.level3 },
  { key: 'Stress', done: 7, total: 10, color: COLORS.level2 },
  { key: 'Digestion', done: 10, total: 14, color: COLORS.level2 },
];

const monthlyProgress = [
  { month: 'Sep 2024', score: 910 },
  { month: 'Oct 2024', score: 980 },
  { month: 'Nov 2024', score: 1040 },
  { month: 'Dec 2024', score: 1080 },
  { month: 'Jan 2025', score: 1140 },
  { month: 'Feb 2025', score: 1210 },
  { month: 'Mar 2025', score: 1280 },
  { month: 'Apr 2025', score: 1350 },
  { month: 'May 2025', score: 1420 },
  { month: 'Jun 2025', score: 1490 },
  { month: 'Jul 2025', score: 1560 },
];

// ========= Main Screen =========
export default function Progress() {
  const [zoomEnabled, setZoomEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 12 }}
      >
        <Text style={styles.screenTitle}>Progress</Text>

        {/* Summary cards */}
        <View style={styles.row}>
          <Card>
            <Text style={styles.cardTitle}>Overall Completion</Text>
            <Text style={[styles.metric, { color: COLORS.black }]}>{completionPct}%</Text>
            <Text style={styles.cardHint}>
              {completedSessions}/{totalSessions} sessions done
            </Text>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Next Session</Text>
            <Text style={[styles.metric, { color: COLORS.blue }]}>Tue, 09 Sep · 10:30</Text>
            <Text style={styles.cardHint}>Abhyanga + Swedana</Text>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Consistency</Text>
            <Text style={[styles.metric, { color: COLORS.red }]}>8-day streak</Text>
            <Text style={styles.cardHint}>Strong adherence</Text>
          </Card>
        </View>

        {/* Therapy-wise completion: grid of compact pies */}
        <ChartCard
          title="Therapy-wise Completion"
          hint="Completed vs remaining per therapy"
        >
          <TherapyGrid therapies={therapyFields} />
        </ChartCard>

        {/* Overall therapy completion donut */}
        <View style={styles.row}>
          <ChartCard title="Level Progress" hint="Progress by therapy levels" style={{ flexGrow: 1 }}>
            {V ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.levelProgressContainer}>
                  <LevelProgress level={1} percent={64} color={COLORS.level1} />
                  <LevelProgress level={2} percent={79} color={COLORS.level2} />
                  <LevelProgress level={3} percent={97} color={COLORS.level3} />
                </View>
              </View>
            ) : (
              <LevelProgressFallback />
            )}
          </ChartCard>

          {/* Compact KPI card */}
          <Card style={{ flexGrow: 1 }}>
            <Text style={styles.cardTitle}>Side-Effects (last 14d)</Text>
            <Text style={[styles.metric, { color: COLORS.black }]}>Mild (2)</Text>
            <View style={{ height: 10 }} />
            <Text style={styles.cardTitle}>Daily Check-ins</Text>
            <Text style={[styles.metric, { color: COLORS.blue }]}>86%</Text>
            <Text style={styles.cardHint}>Past month</Text>
          </Card>
        </View>

        {/* Month-to-month: connected line + dotted points */}
        <ChartCard
          title="Monthly Progress Trend"
          hint="Click on the graph to enable the zoom feature"
        >
          <TouchableWithoutFeedback onPress={() => setZoomEnabled(!zoomEnabled)}>
            <View>
              {V ? (
                <V.VictoryChart
                  height={300}
                  width={CHART_W}
                  padding={{ top: 24, bottom: 48, left: 52, right: 20 }}
                  domain={{ y: [800, 1600] }}
                  containerComponent={
                    zoomEnabled ? 
                    <V.VictoryZoomContainer/> : 
                    <V.VictoryContainer/>
                  }
                >
                  <V.VictoryAxis
                    tickValues={monthlyProgress.map((m) => m.month)}
                    style={{
                      axis: { stroke: COLORS.border },
                      tickLabels: { 
                        fill: COLORS.subtext, 
                        fontSize: 10, 
                        padding: 8, 
                        fontFamily: fontBase(),
                        angle: -45,
                        textAnchor: 'end',
                      },
                    }}
                  />
                  <V.VictoryAxis
                    dependentAxis
                    style={{
                      axis: { stroke: COLORS.border },
                      tickLabels: { 
                        fill: COLORS.subtext, 
                        fontSize: 10, 
                        padding: 6, 
                        fontFamily: fontBase() 
                      },
                      grid: { stroke: COLORS.border, strokeDasharray: '2,6' },
                    }}
                  />
                  <V.VictoryLine
                    interpolation="monotoneX"
                    style={{
                      data: { stroke: COLORS.blue, strokeWidth: 3 },
                    }}
                    data={monthlyProgress}
                    x="month"
                    y="score"
                  />
                  <V.VictoryScatter
                    size={5}
                    style={{ 
                      data: { 
                        fill: COLORS.red, 
                        stroke: COLORS.black, 
                        strokeWidth: 1 
                      } 
                    }}
                    data={monthlyProgress}
                    x="month"
                    y="score"
                  />
                </V.VictoryChart>
              ) : (
                <DottedLineFallback data={monthlyProgress} />
              )}
              
              {zoomEnabled && (
                <Text style={styles.zoomHint}>
                  Zoom enabled - Pinch to zoom, drag to pan
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ChartCard>
      </ScrollView>
    </SafeAreaView>
  );
}

// ========= UI Subcomponents =========

function Card(props) {
  return <View style={[styles.card, props.style]}>{props.children}</View>;
}

function ChartCard(props) {
  return (
    <View style={[styles.chartCard, props.style]}>
      <Text style={styles.sectionTitle}>{props.title}</Text>
      {!!props.hint && <Text style={styles.sectionHint}>{props.hint}</Text>}
      {props.children}
    </View>
  );
}

function Legend(props) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: props.color }]} />
      <Text style={styles.legendText}>{props.label}</Text>
    </View>
  );
}

function TherapyGrid(props) {
  const perRow = CHART_W > 420 ? 3 : 2;
  const itemW = (CHART_W - (perRow - 1) * 10) / perRow;

  return (
    <View style={{ width: CHART_W, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
      {props.therapies.map((t) => {
        const done = Math.max(0, Math.min(t.done, t.total));
        const pct = t.total === 0 ? 0 : Math.round((done / t.total) * 100);

        return (
          <View
            key={t.key}
            style={[
              styles.therapyItem,
              { width: itemW, marginBottom: 12 },
            ]}
          >
            <Text numberOfLines={1} style={styles.therapyTitle}>{t.key}</Text>

            {V ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: itemW }}>
                {/* White background circle to ensure inner area is white */}
                <View style={[styles.innerCircle, { 
                  width: itemW * 0.6, 
                  height: itemW * 0.6,
                  borderRadius: itemW * 0.3,
                }]} />
                <V.VictoryPie
                  width={itemW}
                  height={itemW}
                  innerRadius={itemW * 0.6}
                  padAngle={0}
                  startAngle={90}
                  endAngle={450}
                  colorScale={[t.color, COLORS.grayTrack]}
                  labels={() => null}
                  data={[
                    { x: 'Done', y: done },
                    { x: 'Left', y: Math.max(0, t.total - done) },
                  ]}
                  style={{ data: { stroke: '#fff', strokeWidth: 1 } }}
                />
                <View style={styles.pieCenterMini}>
                  <Text style={[styles.pieMiniPct, { color: COLORS.black }]}>{pct}%</Text>
                </View>
              </View>
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: itemW }}>
                <MiniPieFallback pct={pct} size={itemW} color={t.color} />
              </View>
            )}

            <Text style={styles.therapySub}>
              {done}/{t.total} sessions
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function LevelProgress(props) {
  const ringWidth = 12;
  const size = 80;
  
  return (
    <View style={styles.levelItem}>
      <Text style={styles.levelLabel}>Level {props.level}</Text>
      <View style={styles.levelChart}>
        {V ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {/* White background circle */}
            <View style={[styles.innerCircle, { 
              width: size - ringWidth * 2, 
              height: size - ringWidth * 2,
              borderRadius: (size - ringWidth * 2) / 2,
            }]} />
            <V.VictoryPie
              width={size}
              height={size}
              innerRadius={size/2 - ringWidth}
              padAngle={0}
              startAngle={90}
              endAngle={450}
              colorScale={[props.color, COLORS.grayTrack]}
              labels={() => null}
              data={[
                { x: 'Done', y: props.percent },
                { x: 'Left', y: 100 - props.percent },
              ]}
              style={{ data: { stroke: '#fff', strokeWidth: 1 } }}
            />
            <View style={[styles.pieCenterMini, { width: size, height: size }]}>
              <Text style={[styles.levelPercent, { color: COLORS.black }]}>{props.percent}%</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.levelFallback, { width: size, height: size }]}>
            <Text style={styles.levelPercent}>{props.percent}%</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ========= Fallbacks (no charts lib) =========

function LevelProgressFallback() {
  return (
    <View style={styles.levelProgressContainer}>
      <View style={styles.levelItem}>
        <Text style={styles.levelLabel}>Level 1</Text>
        <View style={[styles.levelFallback, { width: 80, height: 80 }]}>
          <Text style={styles.levelPercent}>64%</Text>
        </View>
      </View>
      <View style={styles.levelItem}>
        <Text style={styles.levelLabel}>Level 2</Text>
        <View style={[styles.levelFallback, { width: 80, height: 80 }]}>
          <Text style={styles.levelPercent}>79%</Text>
        </View>
      </View>
      <View style={styles.levelItem}>
        <Text style={styles.levelLabel}>Level 3</Text>
        <View style={[styles.levelFallback, { width: 80, height: 80 }]}>
          <Text style={styles.levelPercent}>97%</Text>
        </View>
      </View>
    </View>
  );
}

function MiniPieFallback(props) {
  const ringWidth = Math.max(8, Math.floor(props.size * 0.15));
  const innerRadius = props.size * 0.6;
  
  return (
    <View style={[styles.miniPieFallbackContainer, { width: props.size, height: props.size }]}>
      {/* Background circle for the ring */}
      <View style={[
        styles.miniPieRingBackground,
        { 
          width: props.size, 
          height: props.size,
          borderRadius: props.size / 2,
          borderWidth: ringWidth,
          borderColor: COLORS.grayTrack,
        }
      ]} />
      
      {/* Colored progress arc */}
      <View style={[
        styles.miniPieRingProgress,
        { 
          width: props.size, 
          height: props.size,
          borderWidth: ringWidth,
          borderColor: props.color,
          transform: [{ rotate: `${-90}deg` }],
        }
      ]} />
      
      {/* White inner circle */}
      <View style={[
        styles.miniPieInnerCircle,
        {
          width: innerRadius,
          height: innerRadius,
          borderRadius: innerRadius / 2,
        }
      ]} />
      
      <Text style={[styles.pieMiniPct, { color: COLORS.black }]}>{props.pct}%</Text>
    </View>
  );
}

function DottedLineFallback(props) {
  const { width: winW } = useWindowDimensions();
  const [box, setBox] = React.useState({ w: 0, h: 0 });

  const min = Math.min(...props.data.map((d) => d.score));
  const max = Math.max(...props.data.map((d) => d.score));
  const pad = 18;
  const W = Math.min(winW - 32, CHART_W);

  const Segment = ({ x1, y1, x2, y2 }) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return (
      <View
        style={{
          position: 'absolute',
          left: x1,
          top: y1,
          width: len,
          height: 2,
          backgroundColor: COLORS.blue,
          transform: [{ rotateZ: `${angle}deg` }],
        }}
      />
    );
  };

  return (
    <View style={{ width: W, marginTop: 8 }}>
      <InstallHint />
      <View
        style={[styles.dottedBox]}
        onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        {[0.25, 0.5, 0.75].map((g) => (
          <View
            key={g}
            style={[
              styles.gridLine,
              { top: g * (box.h - pad * 2) + pad },
            ]}
        />
        ))}

        {box.w > 0 &&
          props.data.map((d, i) => {
            const x = pad + (i / (props.data.length - 1)) * (box.w - pad * 2);
            const y =
              pad +
              (1 - (d.score - min) / Math.max(1, max - min)) * (box.h - pad * 2);

            if (i > 0) {
              const prev = props.data[i - 1];
              const px =
                pad + ((i - 1) / (props.data.length - 1)) * (box.w - pad * 2);
              const py =
                pad +
                (1 - (prev.score - min) / Math.max(1, max - min)) * (box.h - pad * 2);
              return (
                <React.Fragment key={d.month}>
                  <Segment x1={px} y1={py} x2={x} y2={y} />
                  <View
                    style={[
                      styles.dot,
                      { left: x - 5, top: y - 5, backgroundColor: COLORS.red, borderColor: COLORS.black, borderWidth: 1 },
                    ]}
                  />
                </React.Fragment>
              );
            }

            return (
              <View
                key={d.month}
                style={[
                  styles.dot,
                  { left: x - 5, top: y - 5, backgroundColor: COLORS.red, borderColor: COLORS.black, borderWidth: 1 },
                ]}
              />
            );
          })}
      </View>

      <View style={styles.monthRow}>
        {props.data.map((d) => (
          <Text key={d.month} style={styles.monthLabel}>
            {d.month}
          </Text>
        ))}
      </View>
    </View>
  );
}

function InstallHint() {
  return (
    <Text style={{ color: COLORS.subtext, fontSize: 12, marginBottom: 8, fontFamily: fontBase() }}>
      Charts unavailable. Install "victory-native" + "react-native-svg", then restart.
    </Text>
  );
}

// ========= Fonts =========
function fontBase() {
  return Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });
}
function fontHeavy() {
  return Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });
}

// ========= Styles =========
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 16 },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: 0.2,
    marginBottom: 8,
    fontFamily: fontHeavy(),
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap' },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: CARD_PAD,
    flexGrow: 1,
    minWidth: (width - 16 * 2 - 12 * 2) / 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: CARD_PAD,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.black,
    alignSelf: 'flex-start',
    fontFamily: fontHeavy(),
  },
  sectionHint: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 2,
    alignSelf: 'flex-start',
    fontFamily: fontBase(),
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.subtext, fontFamily: fontBase() },
  cardHint: { fontSize: 12, color: COLORS.subtext, marginTop: 6, lineHeight: 18, fontFamily: fontBase() },
  metric: { fontSize: 20, fontWeight: '900', marginTop: 6, fontFamily: fontHeavy() },
  innerCircle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  pieCenterMini: { 
    position: 'absolute', 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 2,
  },
  pieMiniPct: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
    fontFamily: fontHeavy(),
  },
  legendRow: { 
    marginTop: 12, 
    flexDirection: 'row', 
    gap: 16, 
    alignSelf: 'center' 
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  legendDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5 
  },
  legendText: { 
    fontSize: 12, 
    color: COLORS.subtext, 
    fontFamily: fontBase() 
  },
  therapyItem: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  therapyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: fontHeavy(),
  },
  therapySub: { 
    fontSize: 12, 
    color: COLORS.subtext, 
    marginTop: 8,
    textAlign: 'center',
    fontFamily: fontBase() 
  },
  levelProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  levelItem: {
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.subtext,
    marginBottom: 8,
    fontFamily: fontBase(),
  },
  levelChart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelPercent: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
    fontFamily: fontHeavy(),
  },
  levelFallback: {
    borderWidth: 12,
    borderColor: COLORS.grayTrack,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPieFallbackContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPieRingBackground: {
    position: 'absolute',
    borderColor: COLORS.grayTrack,
  },
  miniPieRingProgress: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  miniPieInnerCircle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  dottedBox: {
    height: 240,
    width: '100%',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: '#FFF',
    marginTop: 4,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  monthLabel: { 
    fontSize: 10, 
    color: COLORS.subtext, 
    fontFamily: fontBase() 
  },
  zoomHint: {
    fontSize: 12,
    color: COLORS.blue,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: fontBase(),
  },
});