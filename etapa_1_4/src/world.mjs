export const PLACES={
 casa:{name:'Seu quarto',x:16,y:10,text:'A janela dá para os telhados de Ponteclara. Sua mochila repousa ao lado da cama.'},
 praca:{name:'Praça da ponte',x:48,y:35,text:'A água corre sob a ponte de pedra. Recados e gente de passagem disputam o quadro de avisos.'},
 mercado:{name:'Mercado',x:83,y:10,text:'Ervas, ferramentas e curiosidades ocupam as bancas. Nem todo vendedor conhece o valor do que tem.'},
 taverna:{name:'Taverna',x:16,y:88,text:'Cheiro de caldo e pão quente. As mesas convidam a uma pausa e a conversas sem pressa.'},
 oficina:{name:'Oficina de Maíra',x:16,y:62,text:'Limalha de cobre brilha no chão. Uma lanterna incompleta espera mãos pacientes.'},
 patio:{name:'Pátio de treino',x:49,y:90,text:'Marcas de botas cercam os alvos de palha. Treinar sozinho é possível; aprender com alguém abre outros caminhos.'},
 bosque:{name:'Bosque',x:83,y:90,text:'A trilha passa entre árvores antigas. Pequenos brilhos desaparecem quando você olha diretamente para eles.'},
 poco:{name:'Poço antigo',x:83,y:62,text:'Runas desgastadas cercam a água escura. Uma vibração discreta sobe pela pedra.'}
};
export const EDGES=[['casa','praca',10],['praca','mercado',10],['praca','taverna',10],['praca','oficina',15],['praca','patio',15],['praca','bosque',25],['oficina','poco',15],['bosque','poco',10]];
export const SKILLS={oficio:'Ofício',alquimia:'Alquimia',arcanismo:'Arcanismo',esgrima:'Esgrima',exploracao:'Exploração'};
export const ORIGINS={artesao:{name:'Aprendiz de artesão',text:'Ofício 35 · conhece ferramentas',skill:'oficio',value:35},ervas:{name:'Coletor de ervas',text:'Alquimia 35 · reconhece reagentes',skill:'alquimia',value:35},viajante:{name:'Viajante',text:'Exploração 35 · lê caminhos',skill:'exploracao',value:35}};
export const RACES={humano:'Humano',elfo:'Elfo',anao:'Anão'};
export const TRAITS={observador:'Observador',sociavel:'Sociável',persistente:'Persistente'};
export const GIFTS={eco:'Eco espiritual',pulso:'Pulso vital',latente:'Potencial latente'};
export function path(from,to){
 const dist={[from]:0},routes={[from]:[]},todo=new Set(Object.keys(PLACES));
 while(todo.size){const here=[...todo].sort((a,b)=>(dist[a]??Infinity)-(dist[b]??Infinity))[0];todo.delete(here);if(here===to)return {minutes:dist[here],legs:routes[here]};
 for(const [a,b,n]of EDGES){const next=a===here?b:b===here?a:null;if(next&&todo.has(next)&&(dist[here]+n)<(dist[next]??Infinity)){dist[next]=dist[here]+n;routes[next]=[...routes[here],{from:here,to:next,minutes:n}];}}}throw Error('Caminho indisponível');
}
const weekdays=['Aurora','Brasa','Folha','Pedra','Vento','Rio','Estrela'];
export function calendar(t){const day=Math.floor(t/1440),minute=t%1440,h=Math.floor(minute/60),year=614+Math.floor(day/365),d=day%365;return {day,hour:h,minute,weekday:weekdays[day%7],date:d<360?`${d%30+1}/${Math.floor(d/30)+1}/${year}`:`Festa ${d-359}/${year}`,time:`${String(h).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`,phase:h<6?'Madrugada':h<12?'Manhã':h<18?'Tarde':'Noite'};}
export function npcPlace(id,t){const h=(t%1440)/60;if(id==='maira')return h>=8&&h<12||h>=13&&h<17?'oficina':h>=12&&h<13?'mercado':'moradia';if(id==='mercador')return h>=8&&h<18?'mercado':'taverna';if(id==='breno')return h>=9&&h<12?'patio':h>=18&&h<22?'taverna':'praca';return 'moradia';}
