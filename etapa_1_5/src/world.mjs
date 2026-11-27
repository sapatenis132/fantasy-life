import {PLACES as basePlaces,EDGES as baseEdges,SKILLS,ORIGINS,RACES,TRAITS,GIFTS,calendar,npcPlace} from '../../etapa_1_4/src/world.mjs';
export {SKILLS,ORIGINS,RACES,TRAITS,GIFTS,calendar,npcPlace};
export const PLACES={...basePlaces,
 margem:{name:'Margem do rio',x:18,y:22,region:'arredores',text:'Uma passarela cedeu sobre o rio. Acima da corrente, a roda do moinho continua batendo sem ninguém para movê-la.'},
 mirante:{name:'Mirante das raízes',x:78,y:22,region:'arredores',text:'Raízes cobrem uma antiga galeria de manutenção. Deste ponto você vê os caminhos e o moinho inteiro.'},
 moinho:{name:'Moinho Afogado',x:25,y:75,region:'arredores',text:'Um caranguejo de cobre patrulha a porta: pás no lugar das pinças, um sino rachado dentro do casco. A cada passo, dentes de engrenagem raspam na pedra.'},
 camara:{name:'Câmara da roda',x:80,y:75,region:'arredores',text:'Um núcleo luminoso força a roda a girar. Presa às runas, uma presença arrasta a voz junto da água: “Ainda não terminou meu turno?”'}
};
export const EDGES=[...baseEdges,['bosque','margem',20],['margem','mirante',15],['margem','moinho',15],['mirante','moinho',10],['moinho','camara',5],['praca','margem',15]];
export function edgeOpen(s,a,b){
 if(!s)return true;const key=[a,b].sort().join(':');
 if(key==='bosque:margem')return !!s.flags.moinho_conhecido;
 if(key==='margem:moinho')return !!s.flags.travessia_segura;
 if(key==='mirante:moinho')return !!s.flags.rota_alta;
 if(key==='camara:moinho')return !!s.flags.guardiao_superado;
 if(key==='margem:praca')return !!s.flags.rota_rio_aberta;
 return true;
}
export function path(from,to,s){
 if(!Object.hasOwn(PLACES,from)||!Object.hasOwn(PLACES,to))throw Error('Lugar desconhecido.');
 const dist={[from]:0},routes={[from]:[]},todo=new Set(Object.keys(PLACES));
 while(todo.size){const here=[...todo].sort((a,b)=>(dist[a]??Infinity)-(dist[b]??Infinity))[0];if(dist[here]===undefined)break;todo.delete(here);if(here===to)return {minutes:dist[here],legs:routes[here]};
  for(const[a,b,n]of EDGES){const next=a===here?b:b===here?a:null;if(next&&todo.has(next)&&edgeOpen(s,here,next)&&dist[here]+n<(dist[next]??Infinity)){dist[next]=dist[here]+n;routes[next]=[...routes[here],{from:here,to:next,minutes:n}];}}
 }return null;
}
export const ACTORS={iria:{name:'Iria',race:'humano',text:'Iria vigia a margem para impedir que alguém se perca nas galerias. Ela quer um caminho seguro, mas não aceita promessas vagas.'},nilo:{name:'Nilo',race:'anao',text:'Nilo conhece a antiga equipe do moinho. Ele quer recuperar o caminho e as ferramentas; não vai arriscar a própria vida para proteger uma relíquia.'}};
export function contextFor(seed){const n=Math.imul(seed^0x45d9f3b,2654435761)>>>0;return {weather:['cheia','nevoa','calmaria'][n%3],actor:n%2?'iria':'nilo'};}
