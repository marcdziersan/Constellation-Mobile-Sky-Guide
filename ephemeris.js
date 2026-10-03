/*
 * Lightweight field ephemerides for CONSTELLATION Mobile.
 * Low-precision orbital elements are sufficient for a visual sky guide.
 * Do not use these calculations for navigation, occultation timing, or scientific measurement.
 */
(() => {
  'use strict';
  const D2R = Math.PI / 180;
  const R2D = 180 / Math.PI;
  const norm360 = x => ((x % 360) + 360) % 360;
  const norm24 = x => ((x % 24) + 24) % 24;
  const sind = x => Math.sin(x * D2R);
  const cosd = x => Math.cos(x * D2R);
  const atan2d = (y,x) => Math.atan2(y,x) * R2D;

  function daysSince2000(date) {
    const jd = date.getTime() / 86400000 + 2440587.5;
    return jd - 2451543.5; // 2000 Jan 0.0 UT, used by the compact elements below.
  }

  function kepler(Mdeg, e) {
    const M = norm360(Mdeg) * D2R;
    let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
    for (let i=0; i<8; i++) {
      const dE = (E - e*Math.sin(E) - M) / (1 - e*Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-10) break;
    }
    return E;
  }

  function orbitalVector(el) {
    const E = kepler(el.M, el.e);
    const xv = el.a * (Math.cos(E) - el.e);
    const yv = el.a * Math.sqrt(1 - el.e*el.e) * Math.sin(E);
    const v = Math.atan2(yv, xv);
    const r = Math.hypot(xv, yv);
    const N = el.N * D2R, i = el.i * D2R, w = el.w * D2R;
    const vw = v + w;
    return {
      x: r * (Math.cos(N)*Math.cos(vw) - Math.sin(N)*Math.sin(vw)*Math.cos(i)),
      y: r * (Math.sin(N)*Math.cos(vw) + Math.cos(N)*Math.sin(vw)*Math.cos(i)),
      z: r * (Math.sin(vw)*Math.sin(i)), r
    };
  }

  function sunElements(d) {
    return {
      N: 0, i: 0,
      w: 282.9404 + 4.70935e-5*d,
      a: 1,
      e: 0.016709 - 1.151e-9*d,
      M: 356.0470 + 0.9856002585*d
    };
  }

  function sunEcliptic(d) {
    const el = sunElements(d);
    const E = kepler(el.M, el.e);
    const xv = Math.cos(E) - el.e;
    const yv = Math.sqrt(1-el.e*el.e) * Math.sin(E);
    const v = atan2d(yv, xv);
    const r = Math.hypot(xv,yv);
    const lon = norm360(v + el.w);
    return { x:r*cosd(lon), y:r*sind(lon), z:0, r, lon, M:norm360(el.M), w:norm360(el.w) };
  }

  function planetElements(name,d) {
    switch(name) {
      case 'Mercury': return {N:48.3313+3.24587e-5*d,i:7.0047+5.00e-8*d,w:29.1241+1.01444e-5*d,a:.387098,e:.205635+5.59e-10*d,M:168.6562+4.0923344368*d};
      case 'Venus':   return {N:76.6799+2.46590e-5*d,i:3.3946+2.75e-8*d,w:54.8910+1.38374e-5*d,a:.723330,e:.006773-1.302e-9*d,M:48.0052+1.6021302244*d};
      case 'Mars':    return {N:49.5574+2.11081e-5*d,i:1.8497-1.78e-8*d,w:286.5016+2.92961e-5*d,a:1.523688,e:.093405+2.516e-9*d,M:18.6021+.5240207766*d};
      case 'Jupiter': return {N:100.4542+2.76854e-5*d,i:1.3030-1.557e-7*d,w:273.8777+1.64505e-5*d,a:5.20256,e:.048498+4.469e-9*d,M:19.8950+.0830853001*d};
      case 'Saturn':  return {N:113.6634+2.38980e-5*d,i:2.4886-1.081e-7*d,w:339.3939+2.97661e-5*d,a:9.55475,e:.055546-9.499e-9*d,M:316.9670+.0334442282*d};
      case 'Uranus':  return {N:74.0005+1.3978e-5*d,i:.7733+1.9e-8*d,w:96.6612+3.0565e-5*d,a:19.18171-1.55e-8*d,e:.047318+7.45e-9*d,M:142.5905+.011725806*d};
      case 'Neptune': return {N:131.7806+3.0173e-5*d,i:1.7700-2.55e-7*d,w:272.8461-6.027e-6*d,a:30.05826+3.313e-8*d,e:.008606+2.15e-9*d,M:260.2471+.005995147*d};
      default: throw new Error('Unknown planet '+name);
    }
  }

  function eclipticXYZToEquatorial(x,y,z,d) {
    const eps = (23.4393 - 3.563e-7*d) * D2R;
    const xe = x;
    const ye = y*Math.cos(eps) - z*Math.sin(eps);
    const ze = y*Math.sin(eps) + z*Math.cos(eps);
    const ra = norm24(atan2d(ye,xe)/15);
    const dec = atan2d(ze, Math.hypot(xe,ye));
    return {ra,dec};
  }

  function sunPosition(date) {
    const d = daysSince2000(date);
    const s = sunEcliptic(d);
    const eq = eclipticXYZToEquatorial(s.x,s.y,s.z,d);
    return {...eq, lon:s.lon, distance:s.r};
  }

  function planetPosition(name,date) {
    const d = daysSince2000(date);
    const sun = sunEcliptic(d);
    const p = orbitalVector(planetElements(name,d));
    // heliocentric planet minus heliocentric Earth = planet + geocentric Sun vector
    const x = p.x + sun.x;
    const y = p.y + sun.y;
    const z = p.z + sun.z;
    const eq = eclipticXYZToEquatorial(x,y,z,d);
    return {...eq, distance:Math.hypot(x,y,z), helioDistance:p.r, lon:norm360(atan2d(y,x))};
  }

  function moonPosition(date) {
    const d = daysSince2000(date);
    const N = norm360(125.1228 - .0529538083*d);
    const i = 5.1454;
    const w = norm360(318.0634 + .1643573223*d);
    const a = 60.2666;
    const e = .054900;
    const M = norm360(115.3654 + 13.0649929509*d);
    const E = kepler(M,e);
    const xv = a*(Math.cos(E)-e);
    const yv = a*Math.sqrt(1-e*e)*Math.sin(E);
    const v = atan2d(yv,xv);
    let r = Math.hypot(xv,yv);

    let lon = norm360(v+w);
    let lat = 0;
    // rotate orbital plane to ecliptic, then derive lon/lat
    const vw=(v+w)*D2R, Nr=N*D2R, ir=i*D2R;
    let x=r*(Math.cos(Nr)*Math.cos(vw)-Math.sin(Nr)*Math.sin(vw)*Math.cos(ir));
    let y=r*(Math.sin(Nr)*Math.cos(vw)+Math.cos(Nr)*Math.sin(vw)*Math.cos(ir));
    let z=r*(Math.sin(vw)*Math.sin(ir));
    lon=norm360(atan2d(y,x));
    lat=atan2d(z,Math.hypot(x,y));

    // Main lunar perturbations; enough to keep the field position useful.
    const sun=sunEcliptic(d);
    const Lm=norm360(N+w+M), Ls=norm360(sun.w+sun.M);
    const D=norm360(Lm-Ls), F=norm360(Lm-N);
    lon += -1.274*sind(M-2*D) + .658*sind(2*D) - .186*sind(sun.M)
      - .059*sind(2*M-2*D) - .057*sind(M-2*D+sun.M) + .053*sind(M+2*D)
      + .046*sind(2*D-sun.M) + .041*sind(M-sun.M) - .035*sind(D)
      - .031*sind(M+sun.M) - .015*sind(2*F-2*D) + .011*sind(M-4*D);
    lat += -.173*sind(F-2*D) - .055*sind(M-F-2*D) - .046*sind(M+F-2*D)
      + .033*sind(F+2*D) + .017*sind(2*M+F);
    r += -.58*cosd(M-2*D) - .46*cosd(2*D);

    lon=norm360(lon);
    x=r*cosd(lon)*cosd(lat); y=r*sind(lon)*cosd(lat); z=r*sind(lat);
    const eq=eclipticXYZToEquatorial(x,y,z,d);
    const elong=norm360(lon-sun.lon);
    const illumination=(1-Math.cos(elong*D2R))/2;
    let phase;
    if(elong<22.5||elong>=337.5) phase='Neumond';
    else if(elong<67.5) phase='Zunehmende Sichel';
    else if(elong<112.5) phase='Erstes Viertel';
    else if(elong<157.5) phase='Zunehmender Mond';
    else if(elong<202.5) phase='Vollmond';
    else if(elong<247.5) phase='Abnehmender Mond';
    else if(elong<292.5) phase='Letztes Viertel';
    else phase='Abnehmende Sichel';
    return {...eq,lon,lat,distanceEarthRadii:r,illumination,phase,elongation:elong};
  }

  const bodies = [
    {id:'sun',name:'Sonne',english:'Sun',symbol:'☉',kind:'Stern',calc:sunPosition},
    {id:'moon',name:'Mond',english:'Moon',symbol:'☾',kind:'Mond',calc:moonPosition},
    {id:'mercury',name:'Merkur',english:'Mercury',symbol:'☿',kind:'Planet',calc:d=>planetPosition('Mercury',d)},
    {id:'venus',name:'Venus',english:'Venus',symbol:'♀',kind:'Planet',calc:d=>planetPosition('Venus',d)},
    {id:'mars',name:'Mars',english:'Mars',symbol:'♂',kind:'Planet',calc:d=>planetPosition('Mars',d)},
    {id:'jupiter',name:'Jupiter',english:'Jupiter',symbol:'♃',kind:'Planet',calc:d=>planetPosition('Jupiter',d)},
    {id:'saturn',name:'Saturn',english:'Saturn',symbol:'♄',kind:'Planet',calc:d=>planetPosition('Saturn',d)},
    {id:'uranus',name:'Uranus',english:'Uranus',symbol:'♅',kind:'Planet',calc:d=>planetPosition('Uranus',d)},
    {id:'neptune',name:'Neptun',english:'Neptune',symbol:'♆',kind:'Planet',calc:d=>planetPosition('Neptune',d)}
  ];

  window.SkyEphemeris = { bodies, sunPosition, moonPosition, planetPosition, daysSince2000 };
})();
