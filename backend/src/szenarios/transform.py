import glob
import json
import os

os.chdir('backend/src/assets/szenarios')

def get_time(d):
    return d.get('time')

def delete_unused_keys(d):
    del d['open']
    del d['close']
    del d['high']
    del d['low']

def read_and_transform(file):
    with open(file) as json_file:
        data = json.load(json_file)

        # Sort for timestamp
        data.sort(key=get_time, reverse=False)
        
        lastItemIndex = len(data) - 1
        for index, d in enumerate(data):
            # Check if it is lastItem and use different delta calculation
            if index == lastItemIndex:
                d['delta'] = 0
            else:
                d['delta'] = (d.get('close') - data[index + 1].get('close'))/d.get('close')
            # Delete unnecessary information to reduce filesize
            delete_unused_keys(d)
        with open('Transformed ' + file, 'w') as out:
            json.dump(data, out, indent=2)

for file in glob.glob('*.json'):
    print("Transforming {} ...".format(file))
    read_and_transform(file)

