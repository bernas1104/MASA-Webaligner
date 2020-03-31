export default function binSearch(arr, coord, min = true) {
    let start = 0;
    let end   = arr.length - 1;
    let result;
    
    if(min){
        while(start <= end){
            let mid = Math.floor((start + end) / 2);

            if(arr[mid] >= coord){
                end = mid - 1;
                
                if(arr[mid] === coord)
                    result = [arr[mid], mid];
            } else {
                start = mid + 1;
            }
        }
    } else {
        while(start <= end){
            let mid = Math.floor((start + end) / 2);

            if(arr[mid] <= coord){
                start = mid + 1;

                if(arr[mid] === coord)
                    result = [arr[mid], mid];
            } else {
                end = mid - 1;
            }
        }
    }

    return result;
}