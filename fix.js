const fs = require('fs');
let content = fs.readFileSync('client/src/pages/history.jsx', 'utf8');

// The replacement was messed up and left hanging tags:
//                                     {logs.map((exp) => (
//                                         <HistoryRow key={exp.id} exp={exp} />
//                                     ))}
//                                             </td>
//                                         </tr>
//                                     ))}

content = content.replace(`                                    {logs.map((exp) => (
                                        <HistoryRow key={exp.id} exp={exp} />
                                    ))}
                                            </td>
                                        </tr>
                                    ))}`, `                                    {logs.map((exp) => (
                                        <HistoryRow key={exp.id} exp={exp} />
                                    ))}`);
fs.writeFileSync('client/src/pages/history.jsx', content);
