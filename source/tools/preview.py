import bpy, os, math, sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bpy.ops.wm.open_mainfile(filepath=os.path.join(ROOT,'raw','journey.blend'))
sc=bpy.context.scene
sc.render.engine='CYCLES'; sc.cycles.samples=24; sc.cycles.device='CPU'
sc.render.resolution_x=1600; sc.render.resolution_y=800
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True
w.node_tree.nodes['Background'].inputs[0].default_value=(0.02,0.02,0.02,1); w.node_tree.nodes['Background'].inputs[1].default_value=1.0
cam=bpy.data.objects.new('cam',bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera=cam
cam.location=(0,-11.5,7.5); cam.rotation_euler=(math.radians(58),0,0); cam.data.lens=40
for loc,e in (((4,-6,8),900),((-6,-3,5),400),((0,6,6),500)):
    l=bpy.data.objects.new('l',bpy.data.lights.new('l','AREA')); l.data.energy=e; l.data.size=4; l.location=loc
    l.rotation_euler=(0,0,0); sc.collection.objects.link(l)
    c=l.constraints.new('TRACK_TO'); c.target=None
    l.rotation_euler=( math.atan2(math.hypot(loc[0],loc[1]),loc[2]),0, math.atan2(loc[0],-loc[1]) )
# floor
bpy.ops.mesh.primitive_plane_add(size=40); f=bpy.context.active_object
m=bpy.data.materials.new('floor'); m.use_nodes=True; m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(0.05,0.05,0.05,1); f.data.materials.append(m)
sc.render.filepath=sys.argv[-1]
bpy.ops.render.render(write_still=True)
