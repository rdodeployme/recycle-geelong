"""Build the 3D props for the 'After you tip' journey in Blender and export one GLB.

Run with the Blender Python module:
    /home/claude/blendenv/bin/python tools/models.py

Each prop is a separate root object (named below) sitting on the origin with its
base at z=0, so the Three.js scene can place and animate them independently.
Units are metres. Blender is Z-up; the glTF exporter converts to Y-up.
"""
import math, os, random
import bpy, bmesh
from mathutils import Vector, Matrix, Euler

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'models', 'journey.glb')
random.seed(7)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


# ---------------------------------------------------------------- materials
def mat(name, color, rough=0.6, metal=0.0, emit=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = 1.0
    return m


def srgb(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


M = {
    'fabric': mat('fabric', srgb('#ecebe6'), 0.92),
    'border': mat('border', srgb('#8f969c'), 0.85),
    'steel': mat('steel', srgb('#b9bec2'), 0.32, 1.0),
    'steelDark': mat('steelDark', srgb('#6f757b'), 0.62, 1.0),
    'strap': mat('strap', srgb('#1a1a1a'), 0.4, 0.6),
    'eps': mat('eps', srgb('#f4f3ee'), 0.95),
    'dense': mat('dense', srgb('#d8d1c1'), 0.38),
    'kraft': mat('kraft', srgb('#b58b5b'), 0.88),
    'kraft2': mat('kraft2', srgb('#a37a4c'), 0.9),
    'kraft3': mat('kraft3', srgb('#c49d6c'), 0.88),
    'tape': mat('tape', srgb('#d9c49a'), 0.5),
    'cardWhite': mat('cardWhite', srgb('#d8d4cb'), 0.85),
    'sofa': mat('sofa', srgb('#5d625e'), 0.9),
    'sofaLeg': mat('sofaLeg', srgb('#2b2420'), 0.5),
    'chunkA': mat('chunkA', srgb('#4a4744'), 0.9),
    'chunkB': mat('chunkB', srgb('#6e6a63'), 0.9),
    'chunkC': mat('chunkC', srgb('#2f3030'), 0.9),
    'chunkD': mat('chunkD', srgb('#8a7f6f'), 0.9),
}


# ---------------------------------------------------------------- helpers
def new_obj(name, me):
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    return ob


def box_bm(bm, size, center=(0, 0, 0), rot=None):
    m = Matrix.Translation(Vector(center))
    if rot is not None:
        m = m @ Euler(rot).to_matrix().to_4x4()
    m = m @ Matrix.Diagonal((*size, 1))
    r = bmesh.ops.create_cube(bm, size=1.0, matrix=m)
    return r['verts']


def finish(ob, bevel=0.0, segs=2, smooth=True):
    if bevel:
        mod = ob.modifiers.new('bev', 'BEVEL')
        mod.width = bevel
        mod.segments = segs
        mod.limit_method = 'ANGLE'
    bpy.context.view_layer.objects.active = ob
    for m in list(ob.modifiers):
        ob.select_set(True)
        bpy.ops.object.modifier_apply(modifier=m.name)
    if smooth:
        for p in ob.data.polygons:
            p.use_smooth = True
    return ob


def parent_all(name, objs):
    root = bpy.data.objects.new(name, None)
    scene.collection.objects.link(root)
    for o in objs:
        o.parent = root
    return root


def curve_obj(name, polylines, depth, res=0, material=None):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = depth
    cu.bevel_resolution = res
    cu.use_fill_caps = True
    for pts in polylines:
        sp = cu.splines.new('POLY')
        sp.points.add(len(pts) - 1)
        for i, p in enumerate(pts):
            sp.points[i].co = (p[0], p[1], p[2], 1)
    ob = new_obj(name + '_c', cu)
    if material:
        cu.materials.append(material)
    bpy.context.view_layer.objects.active = ob
    ob.select_set(True)
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(ob)
    mob = new_obj(name, me)
    if material:
        mob.data.materials.clear()
        mob.data.materials.append(material)
    for p in mob.data.polygons:
        p.use_smooth = True
    return mob


def smooth_pts(pts, n=2):
    for _ in range(n):
        pts = [pts[0]] + [tuple((a + 2 * b + c) / 4 for a, b, c in zip(pts[i - 1], pts[i], pts[i + 1]))
                          for i in range(1, len(pts) - 1)] + [pts[-1]]
    return pts


# ---------------------------------------------------------------- mattress
def build_mattress():
    L, W, H = 1.9, 1.38, 0.26
    parts = []
    # body
    me = bpy.data.meshes.new('mattressBody')
    bm = bmesh.new()
    box_bm(bm, (L, W, H * 0.62), (0, 0, H * 0.31))
    bm.to_mesh(me)
    bm.free()
    body = new_obj('mattressBody', me)
    body.data.materials.append(M['border'])
    finish(body, 0.035, 3)
    parts.append(body)
    # quilted top: subdivided grid with tufts
    nx, ny = 64, 46
    me = bpy.data.meshes.new('mattressTop')
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=nx, y_segments=ny, size=0.5,
                          matrix=Matrix.Diagonal((L - 0.02, W - 0.02, 1, 1)))
    tufts = [((i + 0.5) / 8, (j + 0.5) / 5) for i in range(8) for j in range(5)]
    for v in bm.verts:
        x, y = v.co.x / (L - 0.02) + 0.5, v.co.y / (W - 0.02) + 0.5
        edge = min(x, 1 - x, y, 1 - y)
        dome = max(0.0, min(1.0, edge * 7)) ** 0.6
        dimple = 0.0
        for tx, ty in tufts:
            d2 = ((x - tx) * L) ** 2 + ((y - ty) * W) ** 2
            dimple = max(dimple, math.exp(-d2 / 0.0018))
        v.co.z = H * 0.62 + 0.1 * dome - 0.045 * dimple * dome
    bm.to_mesh(me)
    bm.free()
    top = new_obj('mattressTop', me)
    top.data.materials.append(M['fabric'])
    sol = top.modifiers.new('sol', 'SOLIDIFY')
    sol.thickness = 0.03
    finish(top)
    parts.append(top)
    return parent_all('mattress', parts)


# ---------------------------------------------------------------- spring unit
def helix(cx, cy, r, h, turns, z0=0, squash=1.0, pts_per_turn=22):
    pts = []
    n = int(turns * pts_per_turn)
    for i in range(n + 1):
        t = i / n
        a = t * turns * 2 * math.pi
        rr = r * (0.82 + 0.18 * math.cos(t * math.pi * 2)) if 0.15 < t < 0.85 else r
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a) * squash, z0 + t * h))
    return pts


def build_springs():
    L, W, H = 1.8, 1.28, 0.2
    nx, ny = 10, 7
    lines = []
    for i in range(nx):
        for j in range(ny):
            cx = -L / 2 + L * (i + 0.5) / nx
            cy = -W / 2 + W * (j + 0.5) / ny
            lines.append(helix(cx, cy, 0.068, H, 5.0, 0.02, pts_per_turn=16))
    # border rods top and bottom
    for z in (0.02, 0.02 + H):
        lines.append([(-L / 2, -W / 2, z), (L / 2, -W / 2, z), (L / 2, W / 2, z), (-L / 2, W / 2, z), (-L / 2, -W / 2, z)])
    ob = curve_obj('springsWire', lines, 0.0065, 0, M['steel'])
    return parent_all('springs', [ob])


# ---------------------------------------------------------------- steel bale
def build_steel_bale():
    L, W, H = 1.05, 0.8, 0.78
    lines = []

    def clamp(p):
        return (max(-L / 2, min(L / 2, p[0])), max(-W / 2, min(W / 2, p[1])), max(0.0, min(H, p[2])))

    def to_shell(p, depth=0.05):
        """Keep wire near the outside of the bale, where it is seen."""
        p = Vector(clamp(tuple(p)))
        dists = [(L / 2 - p.x, 0, 1), (p.x + L / 2, 0, -1), (W / 2 - p.y, 1, 1), (p.y + W / 2, 1, -1),
                 (H - p.z, 2, 1), (p.z, 2, -1)]
        dmin, ax, sgn = min(dists)
        if dmin > depth:
            lim = (L / 2, W / 2, H)[ax]
            target = (lim - random.uniform(0.0, depth)) if sgn > 0 else (-lim + random.uniform(0.0, depth))
            if ax == 2:
                target = (H - random.uniform(0, depth)) if sgn > 0 else random.uniform(0, depth)
            p[ax] = target
        return p

    for k in range(420):
        if k % 4 == 0:
            # squashed coil fragment pressed against a face
            c = to_shell(Vector((random.uniform(-L / 2, L / 2), random.uniform(-W / 2, W / 2), random.uniform(0, H))), 0.03)
            pts = helix(0, 0, random.uniform(0.04, 0.075), random.uniform(0.02, 0.05), random.uniform(1.5, 3.5), 0,
                        squash=random.uniform(0.25, 0.9), pts_per_turn=10)
            rot = Euler((random.uniform(0, 3.14), random.uniform(0, 3.14), random.uniform(0, 3.14))).to_matrix()
            pts = [clamp(tuple(c + rot @ Vector(p))) for p in pts]
        else:
            p = to_shell(Vector((random.uniform(-L / 2, L / 2), random.uniform(-W / 2, W / 2), random.uniform(0, H))))
            d = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-0.5, 0.5))).normalized()
            pts = []
            for s in range(20):
                pts.append(tuple(p))
                d = (d + Vector((random.uniform(-0.7, 0.7), random.uniform(-0.7, 0.7), random.uniform(-0.35, 0.35)))).normalized()
                p = to_shell(p + d * 0.05)
            pts = smooth_pts(pts, 1)
        lines.append(pts)
    wire = curve_obj('baleWire', lines, 0.0075, 0, M['steel'])
    # dark core so the bale reads solid
    me = bpy.data.meshes.new('baleCore')
    bm = bmesh.new()
    box_bm(bm, (L * 0.94, W * 0.92, H * 0.94), (0, 0, H * 0.47))
    bm.to_mesh(me)
    bm.free()
    core = new_obj('baleCore', me)
    core.data.materials.append(M['steelDark'])
    finish(core, 0.02, 1)
    # straps
    me = bpy.data.meshes.new('baleStraps')
    bm = bmesh.new()
    for x in (-0.3, 0.0, 0.3):
        box_bm(bm, (0.035, W + 0.03, 0.012), (x, 0, H + 0.006))
        box_bm(bm, (0.035, W + 0.03, 0.012), (x, 0, 0.006))
        box_bm(bm, (0.035, 0.012, H + 0.02), (x, W / 2 + 0.012, H / 2))
        box_bm(bm, (0.035, 0.012, H + 0.02), (x, -W / 2 - 0.012, H / 2))
    bm.to_mesh(me)
    bm.free()
    straps = new_obj('baleStraps', me)
    straps.data.materials.append(M['strap'])
    return parent_all('steelBale', [core, wire, straps])


# ---------------------------------------------------------------- polystyrene pile
def eps_piece(bm, kind, s, c, rot):
    w, d, h = s
    if kind == 'tray':  # U-shaped packaging insert
        box_bm(bm, (w, d, h * 0.3), (c[0], c[1], c[2] - h * 0.35), rot)
        for sgn in (-1, 1):
            m = Matrix.Translation(Vector(c)) @ Euler(rot).to_matrix().to_4x4()
            off = m @ Vector((sgn * w * 0.4, 0, 0))
            box_bm(bm, (w * 0.2, d, h), tuple(off), rot)
    elif kind == 'corner':
        box_bm(bm, (w, d * 0.35, h), (c[0], c[1], c[2]), rot)
        m = Matrix.Translation(Vector(c)) @ Euler(rot).to_matrix().to_4x4()
        off = m @ Vector((0, d * 0.35, -h * 0.3))
        box_bm(bm, (w, d * 0.7, h * 0.4), tuple(off), rot)
    else:
        box_bm(bm, (w, d, h), c, rot)


def build_poly_pile():
    me = bpy.data.meshes.new('polyPile')
    bm = bmesh.new()
    kinds = ['tray', 'corner', 'block', 'tray', 'block', 'corner', 'block']
    R, HM = 1.15, 1.05
    for k in range(46):
        r = R * math.sqrt(random.uniform(0, 1))
        a = random.uniform(0, 2 * math.pi)
        x, y = r * math.cos(a), r * math.sin(a) * 0.62
        top = HM * max(0.0, 1 - (r / R) ** 2)
        w = random.uniform(0.32, 0.62)
        d = random.uniform(0.22, 0.42)
        h = random.uniform(0.12, 0.26)
        z = h / 2 + random.uniform(0, max(0.0, top - h / 2))
        rot = (random.uniform(-0.35, 0.35), random.uniform(-0.35, 0.35), random.uniform(0, 3.14))
        eps_piece(bm, kinds[k % len(kinds)], (w, d, h), (x, y, z), rot)
    bm.to_mesh(me)
    bm.free()
    ob = new_obj('polyPileMesh', me)
    ob.data.materials.append(M['eps'])
    finish(ob, 0.012, 2)
    return parent_all('polyPile', [ob])


def build_poly_block():
    L, W, H = 0.8, 0.52, 0.44
    me = bpy.data.meshes.new('polyBlock')
    bm = bmesh.new()
    box_bm(bm, (L, W, H), (0, 0, H / 2))
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=26, use_grid_fill=True)
    for v in bm.verts:
        on_x = abs(v.co.x) > L / 2 - 1e-4
        n = Vector((math.copysign(1, v.co.x) if on_x else 0,
                    math.copysign(1, v.co.y) if abs(v.co.y) > W / 2 - 1e-4 else 0,
                    1 if v.co.z > H - 1e-4 else (-1 if v.co.z < 1e-4 else 0)))
        if not n.length or v.co.z < 1e-3:
            continue
        # fine extrusion lines running the length of the block, plus a gentle melt wave
        if on_x:
            fine = 0.004 * math.sin(v.co.y * 60) * math.sin(v.co.z * 55)
        else:
            fine = 0.0018 * math.sin((v.co.y + v.co.z) * 210)
        wave = 0.007 * math.sin(v.co.x * 7.5 + v.co.z * 4) * math.cos(v.co.y * 6)
        v.co += n.normalized() * (fine + wave)
    bm.to_mesh(me)
    bm.free()
    ob = new_obj('polyBlockMesh', me)
    ob.data.materials.append(M['dense'])
    finish(ob, 0.03, 3)
    return parent_all('polyBlock', [ob])


# ---------------------------------------------------------------- cardboard
def build_boxes():
    objs = []
    specs = [((0.6, 0.45, 0.42), (-0.55, -0.1, 0.21), 0.1, True),
             ((0.5, 0.4, 0.35), (0.1, 0.25, 0.175), -0.2, False),
             ((0.42, 0.42, 0.3), (0.62, -0.18, 0.15), 0.35, True),
             ((0.48, 0.36, 0.32), (-0.35, 0.05, 0.58), -0.15, False),
             ((0.36, 0.3, 0.26), (0.25, 0.1, 0.48), 0.5, False),
             ((0.7, 0.5, 0.06), (0.0, -0.55, 0.03), 0.05, False),
             ((0.65, 0.45, 0.06), (-0.1, -0.52, 0.09), -0.12, False)]
    for k, (s, c, rz, open_top) in enumerate(specs):
        me = bpy.data.meshes.new(f'box{k}')
        bm = bmesh.new()
        box_bm(bm, s, c, (0, 0, rz))
        if open_top:
            # four flaps folded outwards
            rot = Euler((0, 0, rz)).to_matrix().to_4x4()
            for sx, sy, fw, fd, ang in ((1, 0, s[1], s[0] * 0.45, 'y'), (-1, 0, s[1], s[0] * 0.45, 'y'),
                                        (0, 1, s[0], s[1] * 0.45, 'x'), (0, -1, s[0], s[1] * 0.45, 'x')):
                tilt = 0.9
                if ang == 'y':
                    off = Vector((sx * (s[0] / 2 + fd * 0.35), 0, s[2] / 2 + fd * 0.33))
                    r = (0, -sx * tilt, rz)
                    size = (fd, fw, 0.006)
                else:
                    off = Vector((0, sy * (s[1] / 2 + fd * 0.35), s[2] / 2 + fd * 0.33))
                    r = (sy * tilt, 0, rz)
                    size = (fw, fd, 0.006)
                p = Vector(c) + (rot @ off.to_4d()).to_3d()
                box_bm(bm, size, tuple(p), r)
        bm.to_mesh(me)
        bm.free()
        ob = new_obj(f'boxMesh{k}', me)
        ob.data.materials.append(M['kraft' if k % 3 == 0 else ('kraft2' if k % 3 == 1 else 'kraft3')])
        finish(ob, 0.006, 1, smooth=False)
        objs.append(ob)
        if not open_top and s[2] > 0.1:
            me = bpy.data.meshes.new(f'tape{k}')
            bm = bmesh.new()
            box_bm(bm, (s[0] + 0.004, 0.05, 0.004), (c[0], c[1], c[2] + s[2] / 2 + 0.002), (0, 0, rz))
            bm.to_mesh(me)
            bm.free()
            t = new_obj(f'tapeMesh{k}', me)
            t.data.materials.append(M['tape'])
            objs.append(t)
    return parent_all('boxes', objs)


def build_card_bale():
    L, W, H = 1.1, 0.75, 0.74
    objs = []
    layers = 64
    names = ('kraft', 'kraft2', 'kraft3', 'cardWhite')
    pick = [random.choices(names, weights=(4, 3, 3, 1))[0] for _ in range(layers)]
    for mat_name in names:
        me = bpy.data.meshes.new('cb_' + mat_name)
        bm = bmesh.new()
        for i in range(layers):
            if pick[i] != mat_name:
                continue
            z = (i + 0.5) * H / layers
            for v in bm.verts:
                v.tag = True
            vs = box_bm(bm, (L + random.uniform(-0.03, 0.05), W + random.uniform(-0.02, 0.04), H / layers * 0.9),
                        (random.uniform(-0.015, 0.015), random.uniform(-0.015, 0.015), z),
                        (0, 0, random.uniform(-0.02, 0.02)))
            edges = list({e for v in vs for e in v.link_edges})
            bmesh.ops.subdivide_edges(bm, edges=edges, cuts=4, use_grid_fill=True)
            layer_verts = [v for v in bm.verts if not v.tag]
            for v in layer_verts:
                v.tag = True
                # crumpled, jagged edges; flat-ish faces
                v.co.x += random.uniform(-0.018, 0.018)
                v.co.y += random.uniform(-0.018, 0.018)
                v.co.z += random.uniform(-0.003, 0.003)
        bm.to_mesh(me)
        bm.free()
        ob = new_obj('cbMesh_' + mat_name, me)
        ob.data.materials.append(M[mat_name])
        for p in ob.data.polygons:
            p.use_smooth = False
        objs.append(ob)
    lines = []
    for x in (-0.36, -0.12, 0.12, 0.36):
        y0, y1, z1 = W / 2 + 0.03, -W / 2 - 0.03, H + 0.008
        lines.append([(x, y1, -0.002), (x, y0, -0.002), (x, y0, z1), (x, y1, z1), (x, y1, -0.002)])
    objs.append(curve_obj('cbWire', lines, 0.004, 1, M['strap']))
    return parent_all('cardBale', objs)


# ---------------------------------------------------------------- sofa
def build_sofa():
    me = bpy.data.meshes.new('sofa')
    bm = bmesh.new()
    L, D = 2.05, 0.88
    box_bm(bm, (L, D, 0.26), (0, 0, 0.26))                    # base
    box_bm(bm, (L, 0.2, 0.52), (0, D / 2 - 0.1, 0.62))        # back
    for s in (-1, 1):
        box_bm(bm, (0.18, D, 0.38), (s * (L / 2 - 0.09), 0, 0.52))  # arms
    for i in range(3):
        x = -L / 2 + 0.18 + (L - 0.36) * (i + 0.5) / 3
        box_bm(bm, ((L - 0.36) / 3 - 0.02, D - 0.24, 0.16), (x, -0.08, 0.47))   # seat cushions
        box_bm(bm, ((L - 0.36) / 3 - 0.02, 0.16, 0.42), (x, D / 2 - 0.27, 0.74), (-0.18, 0, 0))  # back cushions
    bm.to_mesh(me)
    bm.free()
    ob = new_obj('sofaMesh', me)
    ob.data.materials.append(M['sofa'])
    finish(ob, 0.045, 3)
    me = bpy.data.meshes.new('sofaLegs')
    bm = bmesh.new()
    for sx in (-1, 1):
        for sy in (-1, 1):
            box_bm(bm, (0.05, 0.05, 0.13), (sx * (L / 2 - 0.08), sy * (D / 2 - 0.08), 0.065))
    bm.to_mesh(me)
    bm.free()
    legs = new_obj('sofaLegsMesh', me)
    legs.data.materials.append(M['sofaLeg'])
    return parent_all('sofa', [ob, legs])


# ---------------------------------------------------------------- residual
def chunk(bm, c, s):
    r = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0,
                                   matrix=Matrix.Translation(Vector(c)) @
                                   Euler((random.uniform(0, 6), random.uniform(0, 6), random.uniform(0, 6))).to_matrix().to_4x4() @
                                   Matrix.Diagonal((s[0], s[1], s[2], 1)))
    for v in r['verts']:
        v.co += Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1))) * min(s) * 0.25


def build_residual(name, cube=False):
    objs = []
    groups = {k: bmesh.new() for k in ('chunkA', 'chunkB', 'chunkC', 'chunkD')}
    keys = list(groups)
    if cube:
        L, W, H = 0.95, 0.66, 0.6
        n = 0
        for ix in range(7):
            for iy in range(5):
                for iz in range(5):
                    c = (-L / 2 + L * (ix + 0.5) / 7, -W / 2 + W * (iy + 0.5) / 5, H * (iz + 0.5) / 5)
                    chunk(groups[keys[n % 4]], c, (L / 7 * 0.75, W / 5 * 0.75, H / 5 * 0.7))
                    n += 1
    else:
        for i in range(70):
            r = random.uniform(0, 1.05)
            a = random.uniform(0, 6.283)
            h = max(0.08, 0.95 * (1 - r / 1.1) + random.uniform(-0.1, 0.1))
            c = (r * math.cos(a), r * math.sin(a) * 0.7, random.uniform(0.05, h))
            s = (random.uniform(0.08, 0.28), random.uniform(0.06, 0.2), random.uniform(0.05, 0.18))
            chunk(groups[keys[i % 4]], c, s)
    for k, bm in groups.items():
        me = bpy.data.meshes.new(name + k)
        bm.to_mesh(me)
        bm.free()
        ob = new_obj(name + '_' + k, me)
        ob.data.materials.append(M[k])
        for p in ob.data.polygons:
            p.use_smooth = False
        objs.append(ob)
    return parent_all(name, objs)


roots = [
    build_mattress(), build_springs(), build_steel_bale(),
    build_poly_pile(), build_poly_block(),
    build_boxes(), build_card_bale(),
    build_sofa(),
    build_residual('residualPile'), build_residual('residualCube', cube=True),
]

# spread them out for the preview render only; Three.js re-positions everything
for i, r in enumerate(roots):
    r.location = ((i % 5) * 2.6 - 5.2, (i // 5) * 2.4, 0)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_apply=True,
                          export_yup=True, export_cameras=False, export_lights=False)
print('exported', OUT, os.path.getsize(OUT))
for o in roots:
    tris = 0
    for c in o.children:
        if c.type == 'MESH':
            c.data.calc_loop_triangles()
            tris += len(c.data.loop_triangles)
    print(f'  {o.name:14s} tris={tris}')

# preview render (Cycles CPU, low samples) so the props can be checked by eye
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'raw', 'journey.blend'))
