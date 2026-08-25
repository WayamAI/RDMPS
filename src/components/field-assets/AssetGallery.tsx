import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import PhotoPlate from './PhotoPlate'
import { EASE, FONT_BODY, FONT_DISPLAY, FONT_MONO, SpecChip } from './shared'

type Asset = {
  photo: string
  alt: string
  caption: string
  title: string
  body: string
  sensors?: string[]
  chips: string[]
}

const ASSETS: Asset[] = [
  {
    photo: '/photo-point-machine.jpg',
    alt: 'Electro-mechanical point machine mounted beside railway turnout rails',
    caption: 'Plate 01 · Point machine · Required system site',
    title: 'Point Machines  EOP 00',
    body: 'The highest-value asset in the Required system. Every throw is captured as a 20 ms-resolution current signature and compared against 15-day, state-conditional rolling averages (N→R and R→N separately).',
    sensors: [
      'motor current (DC-A)',
      'operating voltage',
      'throw duration',
      'detection contacts',
      'obstruction switch',
      'temperature',
      'vibration',
      'relay PF contacts',
    ],
    chips: ['20 ms event signature', 'LD1 80 · LD2 90 · HD 150'],
  },
  {
    photo: '/photo-dc-track-circuit.jpg',
    alt: 'DC track circuit feed relay in a location box beside running rails',
    caption: 'Plate 02 · DC track circuit  bonded rail feed',
    title: 'DC Track Circuits  DCT 20',
    body: 'Nine parameters per circuit: feed/relay-end voltage and current, ballast leakage, relay pickup/dropaway signatures. Track logics use the richest threshold set in requirement module C (LD1/LD2/LD3, HD1/HD2).',
    chips: ['9 sensors', 'LD1 80 · LD2 50 · LD3 90 · HD1 120 · HD2 150'],
  },
  {
    photo: '/photo-led-signal.jpg',
    alt: 'Indian Railways colour-light LED signal showing red aspect at dusk',
    caption: 'Plate 03 · LED colour-light signal',
    title: 'Signals  LED 10 · LES/LEC/LER 11–13',
    body: 'Main signals carry 3+2 sensors (current, voltage, aspect prove-out, plus relay and cable insulation), calling-on 3, shunt 6. LED aspect current drift is the earliest predictor of driver-card failure.',
    chips: ['main 3+2 · calling-on 3 · shunt 6', 'LD 80 · HD 120'],
  },
  {
    photo: '/photo-ips-room.jpg',
    alt: 'Integrated Power Supply room with IPS module racks and battery banks',
    caption: 'Plate 04 · IPS room  power chain',
    title: 'Integrated Power Supply  IPS 50 · SPD 51 · ELD 60',
    body: 'The IPS feeds everything  including RDPMS itself (24 V DC, N+1). Monitored with room environment across seven equipment-room classes (RR/IPS/BATT/MAIN/GEN/OUTDOOR/LOC, ids F0–F6), plus surge protection and earth-leakage devices.',
    chips: ['asset 50', 'rooms F0–F6', '24 V DC +20%/−30%'],
  },
  {
    photo: '/photo-edge-gateway.jpg',
    alt: 'DIN-rail IoT edge gateway with antennas and wired terminal blocks',
    caption: 'Plate 05 · IoT node & station gateway',
    title: 'IoT Node & Station Gateway',
    body: 'DIN-rail IoT nodes scan at ≤20 ms and buffer ≥10 lakh events; the station gateway aggregates over RS485/Modbus, stores ≥50 lakh events, and speaks MQTT over mTLS with a GPS/IRNSS-disciplined clock.',
    chips: ['≥10 lakh FIFO', '≥50 lakh store & forward', 'port 8883'],
  },
  {
    photo: '/photo-control-centre.jpg',
    alt: 'Railway control centre wall of monitors with dashboards and alert panels',
    caption: 'Plate 06 · Control centre  data consumption',
    title: 'Where the data lands',
    body: 'Requirement module E web dashboards for JE/SSE/ASTE/DSTE, requirement module G mobile app with Ack, and the common Railway dashboard fed by five requirement module F APIs.',
    chips: ['≤1 min alert latency', 'one-alert-per-asset'],
  },
]

const textVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const textItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
}
const sensorItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
}
const sensorList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export default function AssetGallery() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
      <div className="flex flex-col gap-16 md:gap-24">
        {ASSETS.map((a, i) => {
          const photoLeft = i % 2 === 0
          return (
            <div
              key={a.title}
              className={`flex flex-col items-center gap-10 lg:gap-14 ${photoLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
            >
              <div className="w-full lg:w-[55%]">
                <PhotoPlate
                  src={a.photo}
                  alt={a.alt}
                  caption={a.caption}
                  side={photoLeft ? 'left' : 'right'}
                />
              </div>
              <motion.div
                variants={textVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className="w-full lg:w-[45%]"
              >
                <motion.h3
                  variants={textItem}
                  className={`${FONT_DISPLAY} text-[20px] font-semibold tracking-tight text-text-primary sm:text-[22px]`}
                >
                  {a.title}
                </motion.h3>
                <motion.p
                  variants={textItem}
                  className={`${FONT_BODY} mt-3 text-[15px] leading-relaxed text-text-secondary`}
                >
                  {a.body}
                </motion.p>
                {a.sensors && (
                  <motion.ul variants={sensorList} className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {a.sensors.map((s) => (
                      <motion.li
                        key={s}
                        variants={sensorItem}
                        className={`${FONT_MONO} flex items-center gap-2 text-[11px] text-text-secondary`}
                      >
                        <Check size={13} className="shrink-0 text-ok" strokeWidth={2.5} />
                        {s}
                      </motion.li>
                    ))}
                    <motion.li
                      variants={sensorItem}
                      className={`${FONT_MONO} flex items-center gap-2 text-[11px] text-text-tertiary`}
                    >
                      <span className="inline-block h-[5px] w-[5px] rounded-full bg-flow-required" />
                      ≥8 sensors
                    </motion.li>
                  </motion.ul>
                )}
                <motion.div variants={textItem} className="mt-5 flex flex-wrap gap-2">
                  {a.chips.map((c) => (
                    <SpecChip key={c} tone="slate" inView>
                      {c}
                    </SpecChip>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
