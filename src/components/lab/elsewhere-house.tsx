import { WORLD, props, rooms, type PropId, type Room } from "@/lib/elsewhere";

function box(id: Room["id"]) {
  const room = rooms.find((item) => item.id === id);
  if (!room) return {};
  return { left: room.x, top: room.y, width: room.w, height: room.h };
}

function local(id: PropId) {
  const prop = props.find((item) => item.id === id);
  if (!prop) return {};
  const room = rooms.find((item) => item.id === prop.room);
  if (!room) return {};
  return {
    left: prop.x - room.x,
    top: prop.y - room.y,
    width: prop.w,
    height: prop.h,
  };
}

export function ElsewhereHouse() {
  return (
    <div className="el-world" style={{ width: WORLD.w, height: WORLD.h }}>
      <div className="el-sky" aria-hidden="true" />
      <div className="el-horizon" aria-hidden="true" />
      <div className="el-street" aria-hidden="true" />
      <div className="el-rain" aria-hidden="true" />

      <section className="el-room el-stoop" style={box("stoop")}>
        <div className="el-stoop-stack" />
        <div className="el-rail" />
        <div className="el-door">
          <span className="el-transom" />
          <span className="el-knob" />
        </div>
        <div className="el-streetlamp" />
        <div className="el-puddle" />
        <p className="el-scratch">·</p>
      </section>

      <section className="el-room el-hall" style={box("hall")}>
        <div className="el-runner" />
        <div className="el-radiator" />
        <div className="el-frames">
          <span />
          <span />
          <span />
        </div>
        <div className="el-coat" />
        <p className="el-scratch el-scratch-hall">in</p>
      </section>

      <section className="el-room el-living" style={box("living")}>
        <div className="el-ceiling-hole" />
        <button
          type="button"
          className="el-window"
          style={local("window")}
          data-prop="window"
          aria-label="window"
        >
          <span className="el-sash" />
          <span className="el-citygrid" />
        </button>
        <button
          type="button"
          className="el-clock"
          style={local("clock")}
          data-prop="clock"
          aria-label="clock"
        >
          <span className="el-clock-face">
            <i className="el-hand-hour" />
            <i className="el-hand-sec" />
          </span>
        </button>
        <div className="el-couch" />
        <div className="el-plant" />
        <div className="el-papers" />
        <div className="el-tracks" />
        <button
          type="button"
          className="el-radio"
          style={local("radio")}
          data-prop="radio"
          aria-label="radio"
        >
          <span className="el-radio-dial" />
          <span className="el-radio-waves" aria-hidden="true" />
        </button>
      </section>

      <section className="el-room el-kitchen" style={box("kitchen")}>
        <div className="el-tile" />
        <div className="el-sink" />
        <div className="el-chair" />
        <button
          type="button"
          className="el-glass"
          style={local("glass")}
          data-prop="glass"
          aria-label="glass of water"
        >
          <span />
        </button>
        <button
          type="button"
          className="el-fridge"
          style={local("fridge")}
          data-prop="fridge"
          aria-label="fridge"
        >
          <span className="el-fridge-door" />
          <span className="el-fridge-city" />
        </button>
        <p className="el-scratch el-scratch-kit">left open</p>
      </section>

      <section className="el-room el-roof" style={box("roof")}>
        <div className="el-parapet" />
        <div className="el-tower" />
        <div className="el-vent" />
        <div className="el-stars" />
      </section>

      <section className="el-room el-well" style={box("well")}>
        <div className="el-shaft" />
        <div className="el-rungs" />
        <div className="el-bulb" />
        <p className="el-scratch el-scratch-well">further</p>
      </section>

      <section className="el-room el-under" style={box("under")}>
        <div className="el-tile-wall" />
        <div className="el-platform" />
        <div className="el-ad" />
        <button
          type="button"
          className="el-bench"
          style={local("bench")}
          data-prop="bench"
          aria-label="bench"
        />
      </section>

      <div className="el-train" data-train="true">
        <span className="el-train-nose" />
        <span className="el-train-windows">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>

      <button
        type="button"
        className="el-disc"
        data-prop="disc"
        aria-label="ring"
      />
    </div>
  );
}
