import hexacopter from './assets/experiments/hexacopter.svg';
import { CaelumVectorSchema } from './schema';
import { diagramVariant } from './experiments';

export function ExperimentalSchema() {
  if (diagramVariant === 'blueprint') return <CaelumVectorSchema />;
  return <div className="illustrated-diagram">
    <CaelumVectorSchema />
    <img className="illustrated-airframe" src={hexacopter} alt=""
      aria-hidden="true" />
    <a className="diagram-credit" href="https://commons.wikimedia.org/wiki/File:Black_Hexacopter_Drone.svg"
      target="_blank" rel="noopener noreferrer">Hexacopter: Manuel Campagnoli · CC BY-SA 4.0</a>
  </div>;
}
